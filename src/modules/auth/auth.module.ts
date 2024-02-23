import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'

import UserEntity from 'src/entities/user.entity'
import FileEntity from 'src/entities/file.entity'
import AuthService from './auth.service'
import UploadModule from '../upload/upload.module'
import EmailModule from '../email/email.module'
import { JwtStrategy } from './strategy'
import OpenSearchModule from '../open-search/open-search.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FileEntity,
    ]),
    JwtModule.register({}),
    UploadModule,
    EmailModule,
    OpenSearchModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
class AuthModule {}

export default AuthModule
