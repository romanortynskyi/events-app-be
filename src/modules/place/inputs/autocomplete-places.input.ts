import { Field, InputType } from '@nestjs/graphql'
import {
  Min,
  IsString,
  Length,
} from 'class-validator'

@InputType()
class AutocompletePlacesInput {
  @Field()
  @Min(0)
  skip: number

  @Field()
  @Min(0)
  limit: number

  @Field()
  @IsString()
  @Length(0)
  query: string
}

export default AutocompletePlacesInput
