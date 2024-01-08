import { Field, ObjectType } from '@nestjs/graphql'
import MatchedSubstring from './matched-substring'
import StructuredFormatting from './structured-formatting'
import Term from './term'

@ObjectType()
class AutocompletePlacesPrediction {
  @Field()
  description: string

  @Field(() => [MatchedSubstring])
  matchedSubstrings: MatchedSubstring[]

  @Field()
  placeId: string

  @Field(() => StructuredFormatting)
  structuredFormatting: StructuredFormatting

  @Field(() => [Term])
  terms: Term[]

  @Field(() => [String])
  types: string[]
}

export default AutocompletePlacesPrediction
