import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, Matches } from 'class-validator'

@InputType()
class VerifyRecoveryCodeInput {
  @Field()
  @Matches(/^[0-9]{6}$/, { message: 'recoveryCode should consist of 6 digits' })
  recoveryCode: string

  @Field()
  @IsEmail()
  email: string
}

export default VerifyRecoveryCodeInput
