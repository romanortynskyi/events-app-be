import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export default class Location {
  @Field()
  lat: number

  @Field()
  lng: number
}