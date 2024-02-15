import { Field, ObjectType } from '@nestjs/graphql'

import Location from './location'
import Model from './model'

@ObjectType()
class Place extends Model {
  
  @Field()
  originalId: string

  // @Field()
  // name: string

  // @Field()
  // url: string

  @Field()
  location: Location

  // @Field()
  // country: string

  // @Field()
  // locality: string
}

export default Place
