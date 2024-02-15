import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Location {
  @Field()
  latitude: number

  @Field()
  longitude: number
}

export default Location
