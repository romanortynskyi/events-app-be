import { Field, ObjectType } from '@nestjs/graphql'
import MatchedSubstring from './matched-substring'

@ObjectType()
class StructuredFormatting {
  @Field()
  mainText: string

  @Field(() => [MatchedSubstring])
  mainTextMatchedSubstrings: MatchedSubstring[]

  @Field()
  secondaryText: string
}

export default StructuredFormatting
