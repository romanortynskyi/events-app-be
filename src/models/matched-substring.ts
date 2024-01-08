import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class MatchedSubstring {
  @Field()
  length: number

  @Field()
  offset: number
}

export default MatchedSubstring
