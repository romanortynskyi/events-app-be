import { Field, ObjectType } from '@nestjs/graphql'

import Event from './event'
import Highlight from './highlight'

@ObjectType()
class SearchEventResult extends Event {
  @Field(() => [Highlight])
  titleHighlightParts: Highlight[]
}

export default SearchEventResult
