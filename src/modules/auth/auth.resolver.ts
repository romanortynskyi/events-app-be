import { Inject, UseGuards } from '@nestjs/common'
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  Int,
} from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import * as AWS from 'aws-sdk'

import SubscriptionName from '../../enums/subscription-name.enum'
import UserEntity from '../../entities/user.entity'
import SignUpInput from './inputs/sign-up.input'
import AuthService from './auth.service'
import LoginInput from './inputs/login.input'
import UserWithToken from './user-with-token'
import ForgotPasswordInput from './inputs/forgot-password.input'
import UpdateUserImageInput from './inputs/update-user-image.input'
import Progress from 'src/models/progress'
import { JwtGuard } from './guards'
import { CurrentUser } from 'src/decorators/current-user'
import File from 'src/models/file'

const pubSub = new PubSub()

@Resolver()
class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

  @Mutation(() => UserWithToken)
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input)
  }

  @Mutation(() => UserWithToken)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input)
  }

  @Mutation(() => UserWithToken)
  loginWithGoogle(@Args('idToken') idToken: string) {
    return this.authService.loginWithGoogle(idToken)
  }

  @Mutation(() => UserWithToken)
  loginWithFacebook(@Args('accessToken') accessToken: string) {
    return this.authService.loginWithFacebook(accessToken)
  }

  @Mutation(() => Boolean)
  sendResetPasswordEmail(@Args('input') input: ForgotPasswordInput) {
    return this.authService.sendResetPasswordEmail(input)
  }

  @Mutation(() => File)
  @UseGuards(JwtGuard)
  updateUserImage(
    @CurrentUser() user: UserEntity,
    @Args('input') input: UpdateUserImageInput,
  ) {
    return this.authService.updateUserImage(
      user.id,
      input.image,
      async (progress: AWS.S3.ManagedUpload.Progress) => {
        const progressToSend = {
          ...progress,
          userId: user.id,
        }

        await pubSub.publish(
          SubscriptionName.UploadUserImageProgress,
          {
            uploadUserImageProgress: progressToSend,
          },
        )
      }
    )
  }

  @Query(() => UserEntity)
  @UseGuards(JwtGuard)
  getMe(@CurrentUser() user: UserEntity) {
    return user
  }

  @Subscription(() => Progress, {
    name: SubscriptionName.UploadUserImageProgress,
    filter: (payload, variables) => {
      return payload.uploadUserImageProgress.userId === variables.userId
    },
  })
  uploadUserImageProgress(@Args('userId', { type: () => Int }) userId: number) {
    return pubSub.asyncIterator(SubscriptionName.UploadUserImageProgress)
  }
}

export default AuthResolver
