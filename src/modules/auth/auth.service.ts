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
import { Repository } from 'typeorm'

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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly uploadService: UploadService,
    private readonly emailService: EmailService,
  ) {}

  signToken(user: UserEntity) {
    const secret = this.configService.get('JWT_SECRET')

    return this.jwtService.signAsync(user, {
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
    const userWithToken = {
      ...userWithoutPassword,
      token,
    }

    return userWithToken
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

    if (!user) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD)
    }

    const passwordIsCorrect = await argon.verify(user.password, password)

    if (!passwordIsCorrect) {
      throw new UnauthorizedException(WRONG_EMAIL_OR_PASSWORD)
    }

    const userWithoutPassword = getObjectWithoutKeys(user, ['password'])
    const token = await this.signToken(userWithoutPassword)
    const userWithToken = {
      ...userWithoutPassword,
      token,
    }

    return userWithToken
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

    return user
  }
}
