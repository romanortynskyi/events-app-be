import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Progress {
  @Field()
  loaded: number

  @Field()
  total: number

  @Field()
  key: string

  @Field()
  userId: number
}

export default Progress
