import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql'
import {
  IsDate,
  IsNumber,
  IsString,
  Length,
} from 'class-validator'
// @ts-ignore
import * as GraphQLUpload from 'graphql-upload/public/GraphQLUpload.js'
import FileUpload from 'src/models/file-upload'

@InputType()
class EventInput {
  @Field(() => String)
  @IsString()
  @Length(1)
  placeId: string

  @Field(() => String)
  @IsString()
  @Length(1)
  title: string

  @Field(() => String)
  @IsString()
  @Length(1, 256)
  description: string

  @Field(() => String)
  @IsDate()
  startDate: Date

  @Field(() => String)
  @IsDate()
  endDate: Date

  @Field()
  @IsNumber()
  ticketPrice: number

  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>

  @Field(() => [Int])
  categories: number[]
}

export default EventInput
