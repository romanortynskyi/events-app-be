import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, Length } from 'class-validator'

@InputType()
class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsString()
  @Length(6)
  password: string
}

export default LoginInput
