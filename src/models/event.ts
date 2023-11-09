import { Field, ObjectType } from '@nestjs/graphql'
import { EventEntity } from 'src/entities/event.entity'
import Place from './place'

@ObjectType()
export default class Event extends EventEntity {
  @Field()
  place: Place

  @Field()
  distance: number
}