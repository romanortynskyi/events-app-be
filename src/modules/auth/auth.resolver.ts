import { UseGuards } from '@nestjs/common'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'

import { UserEntity } from '../../entities/user.entity'
import SignUpInput from './inputs/sign-up.input'
import { AuthService } from './auth.service'
import LoginInput from './inputs/login.input'
import UserWithToken from './user-with-token'
import ForgotPasswordInput from './inputs/forgot-password.input'
import { CurrentUser } from '../../decorators/current-user'
import { JwtGuard } from './guards'

@Resolver(UserEntity)
class AuthResolver {
  constructor(private authService: AuthService) {}

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

  @Mutation(() => Boolean)
  sendResetPasswordEmail(@Args('input') input: ForgotPasswordInput) {
    return this.authService.sendResetPasswordEmail(input)
  }

  @Query(() => UserEntity)
  @UseGuards(JwtGuard)
  getMe(@CurrentUser() user: UserEntity) {
    return user
  }
}

export default AuthResolver
