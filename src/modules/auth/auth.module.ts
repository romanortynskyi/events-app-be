import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from 'src/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { UploadModule } from '../upload/upload.module'
import { EmailModule } from '../email/email.module'
import { JwtStrategy } from './strategy'
import { FileEntity } from 'src/entities/file.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FileEntity,
    ]),
    JwtModule.register({}),
    UploadModule,
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
