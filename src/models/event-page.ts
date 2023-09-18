import { ObjectType } from '@nestjs/graphql'
import Paginated from './paginated'
import Event from './event'


@ObjectType()
export default class EventPage extends Paginated(Event) {}
