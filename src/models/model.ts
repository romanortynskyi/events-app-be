import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Model {
  @Field()
  id: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

export default Model
