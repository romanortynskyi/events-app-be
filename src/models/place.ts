import { Field, ObjectType } from '@nestjs/graphql'

import Location from './location'
import Model from './model'

@ObjectType()
class Place extends Model {
  @Field()
  originalId: string

  @Field()
  googleMapsUri: string

  @Field()
  location: Location
}

export default Place
