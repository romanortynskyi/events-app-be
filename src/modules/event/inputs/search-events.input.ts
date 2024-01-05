import { Field, InputType } from '@nestjs/graphql'
import {
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator'

@InputType()
class SearchEventsInput {
  @Field(() => String)
  @IsString()
  @Length(1)
  query: string

  @Field(() => Number)
  @IsInt()
  @Min(0)
  skip: number

  @Field(() => Number)
  @IsInt()
  @Min(0)
  limit: number
}

export default SearchEventsInput
