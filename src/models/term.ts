import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Term {
  @Field()
  offset: number

  @Field()
  value: string
}

export default Term
