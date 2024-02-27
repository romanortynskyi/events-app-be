import { ObjectType } from '@nestjs/graphql'

import Paginated from './paginated'
import SearchEventResult from './search-event-result'

@ObjectType()
export default class SearchEventPage extends Paginated(SearchEventResult) {}
