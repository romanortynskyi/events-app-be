import { Field, ObjectType } from '@nestjs/graphql'

import Place from './place'
import User from './user'
import File from './file'
import Model from './model'

@ObjectType()
class Event extends Model {
  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  description: string

  @Field()
  startDate: Date

  @Field()
  endDate: Date

  @Field()
  ticketPrice: number

  @Field(() => User)
  author: User

  @Field(() => File)
  image: File

  @Field(() => Place)
  place: Place

  @Field({ nullable: true })
  distance?: number
}

export default Event
