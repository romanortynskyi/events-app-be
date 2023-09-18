import { Field, ObjectType } from '@nestjs/graphql'
import Geometry from './geometry'

@ObjectType()
export default class Place {
  @Field()
  name: string

  @Field()
  url: string

  @Field()
  geometry: Geometry

  @Field()
  country: string

  @Field()
  locality: string
}