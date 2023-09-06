import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsString, Matches, Length } from 'class-validator'

@InputType()
class ResetPasswordInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @Matches(/^[0-9]{6}$/, { message: 'recoveryCode should consist of 6 digits' })
  recoveryCode: string

  @Field()
  @IsString()
  @Length(6)
  password: string
}

export default ResetPasswordInput
