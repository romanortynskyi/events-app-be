import { Field, ObjectType } from '@nestjs/graphql'

import Location from './location'

@ObjectType()
export default class Geometry {
  @Field()
  location: Location
}