import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, Length } from 'class-validator'

@InputType()
class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  @Length(2)
  language: string
}

export default ForgotPasswordInput
