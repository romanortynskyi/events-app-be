import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, Length } from 'class-validator'

@InputType()
class SignUpInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  @IsString()
  @Length(6)
  password: string

  @Field(() => String)
  @IsString()
  @Length(1)
  firstName: string

  @Field(() => String)
  @IsString()
  @Length(1)
  lastName: string
}

export default SignUpInput
