import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { OAuth2Client } from 'google-auth-library'
import Axios from 'axios'
import { instanceToPlain } from 'class-transformer'

import { UserEntity } from 'src/entities/user.entity'
import { getObjectWithoutKeys } from 'src/utils/get-object-without-keys'
import {
  EMAIL_ALREADY_EXISTS,
  INCORRECT_RECOVERY_CODE,
  USER_NOT_FOUND,
  WRONG_EMAIL_OR_PASSWORD,
} from 'src/enums/error-messages'
import { UploadService } from 'src/modules/upload/upload.service'
import EmailSubject from 'src/enums/email-subject'
import { getRandomCode } from 'src/utils/get-random-code'
import { EmailService } from '../email/email.service'
import SignUpInput from './inputs/sign-up.input'
import LoginInput from './inputs/login.input'
import ForgotPasswordInput from './inputs/forgot-password.input'
import ResetPasswordInput from './inputs/reset-password.input'
import VerifyRecoveryCodeInput from './inputs/verify-recovery-code.input'
import FileProvider from 'src/enums/file-provider.enum'
import { FileEntity } from 'src/entities/file.entity'
import AuthProvider from 'src/enums/auth-provider.enum'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly uploadService: UploadService,
    private readonly emailService: EmailService,
    private dataSource: DataSource,
  ) {}

  signToken(user: UserEntity) {
    const secret = this.configService.get('JWT_SECRET')

    return this.jwtService.signAsync(instanceToPlain(user), {
      expiresIn: '365d',
      secret,
    })
  }

  async signUp(input: SignUpInput) {
    const { email, password, firstName, lastName } = input

    const userByEmail = await this.userRepository.findOneBy({
      email,
    })

    if (userByEmail) {
      throw new ConflictException(EMAIL_ALREADY_EXISTS)
    }

    const hashedPassword = await argon.hash(password)
    const userToInsert = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    }

    const user = await this.userRepository.save(userToInsert)
    const userWithoutPassword = getObjectWithoutKeys(user, ['password'])
    const token = await this.signToken(userWithoutPassword)
    const userToSend = {
      ...userWithoutPassword,
      token,
      provider: AuthProvider.Email,
    }

    return userToSend
  }

  async ensureUserExists(user) {
    const {
      email,
      image,
      firstName,
      lastName,
      provider,
    } = user

    const userByEmail = await this.userRepository.findOneBy({ email })

    if (userByEmail) {
      const token = await this.signToken(userByEmail)
      const userWithToken = {
        ...userByEmail,
        token,
      }

      return userWithToken
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const imageEntity = queryRunner.manager.getRepository(FileEntity).create({
        src: image.src,
        provider: image.provider,
      })

      await queryRunner.manager.save(imageEntity)

      const userEntity = queryRunner.manager.getRepository(UserEntity).create({
        email,
        firstName,
        lastName,
        image: imageEntity,
      })

      await queryRunner.manager.save(userEntity)

      const token = await this.signToken(userEntity)

      await queryRunner.commitTransaction()

      return {
        ...userEntity,
        token,
        provider,
      }
    }

    catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction()
    }
  }

  async login(input: LoginInput) {
    const { email, password } = input

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'createdAt',
        'updatedAt',
      ],
    })

    if (!user || !user.password) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD)
    }

    const passwordIsCorrect = await argon.verify(user.password, password)

    if (!passwordIsCorrect) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD)
    }

    const userWithoutPassword = getObjectWithoutKeys(user, ['password'])
    const token = await this.signToken(userWithoutPassword)
    const userToSend = {
      ...userWithoutPassword,
      token,
      provider: AuthProvider.Email,
    }

    return userToSend
  }

  async loginWithGoogle(idToken: string) {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    })
    

    const {
      email,
      picture: imgSrc,
      given_name: firstName,
      family_name: lastName,
    } = ticket.getPayload()

    const user = await this.ensureUserExists({
      email,
      image: {
        src: imgSrc,
        provider: FileProvider.Google,
      },
      firstName,
      lastName,
      provider: AuthProvider.Google,
    })

    return user
  }

  async loginWithFacebook(accessToken: string) {
    const { data } = await Axios.get(
      'https://graph.facebook.com/me',
      {
        params: {
          fields: [
            'email',
            'first_name',
            'last_name',
            'picture.width(200)',
          ].join(','),
          access_token: accessToken,
        },
      },
    )

    const {
      email,
      first_name: firstName,
      last_name: lastName,
      picture: {
        url: imgSrc,
      },
    } = data

    const user = await this.ensureUserExists({
      email,
      firstName,
      lastName,
      image: {
        src: imgSrc,
        provider: FileProvider.Facebook,
      },
      provider: AuthProvider.Facebook,
    })

    return user
  }

  async sendResetPasswordEmail(input: ForgotPasswordInput) {
    const { email, language } = input

    const user = await this.userRepository.findOneBy({
      email,
    })

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    const { id, firstName } = user
    const recoveryCode = getRandomCode(6)
    await this.userRepository.update(id, { recoveryCode })

    setTimeout(() => {
      this.userRepository.update(id, { recoveryCode: null })
    }, 24 * 60 * 60 * 1000) // 24 hours

    await this.emailService.sendEmail({
      email,
      subject: EmailSubject.ResetPassword,
      language,
      text: {
        recoveryCode,
        firstName,
      },
    })

    return true
  }

  async verifyRecoveryCode(input: VerifyRecoveryCodeInput) {
    const { email, recoveryCode } = input

    const user = await this.userRepository.findOneBy({
      email,
      recoveryCode,
    })

    if (!user) {
      throw new BadRequestException(INCORRECT_RECOVERY_CODE)
    }
  }

  async resetPassword(dto: ResetPasswordInput) {
    const { email, recoveryCode, password } = dto

    const user = await this.userRepository.findOneBy({
      email,
      recoveryCode,
    })

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    const hashedPassword = await argon.hash(password)

    await this.userRepository.update(
      {
        email,
        recoveryCode,
      },
      { password: hashedPassword },
    )
  }

  async getUserByToken(bearerToken: string) {
    const token = bearerToken.split(' ')[1]

    const { id } = this.jwtService.decode(token) as UserEntity

    const user = await this.userRepository.findOneBy({
      id,
    })

    return {
      ...user,
      token: bearerToken,
    }
  }
}
