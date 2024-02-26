import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

import EventInput from './inputs/event.input'
import EventService from './event.service'
import { CurrentUser } from 'src/decorators/current-user'
import UserEntity from 'src/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/guards'
import EventPage from 'src/models/event-page'
import Event from 'src/models/event'
import AutocompleteEventsInput from './inputs/autocomplete-events.input'
import SearchEventsInput from './inputs/search-events.input'
import GetEventsBounds from './inputs/get-events-bounds.input'
import SearchEventPage from 'src/models/search-event-page'

@Resolver(Event)
class EventResolver {
  constructor(private eventService: EventService) {}
  
  @Mutation(() => Event)
  @UseGuards(JwtGuard)
  addEvent(@CurrentUser() user: UserEntity, @Args('input') input: EventInput) {
    return this.eventService.addEvent(input, user.id)
  }

  @Query(() => EventPage)
  getEvents(
    @Args({
      name: 'skip',
      type: () => Int,
      nullable: true,
    }) skip?: number,
    @Args({
      name: 'limit',
      type: () => Int,
      nullable: true,
    }) limit?: number,
    @Args({
      name: 'bounds',
      nullable: true,
    }) bounds?: GetEventsBounds,
  ) {
    return this.eventService.getEvents({
      skip,
      limit,
      bounds,
    })
  }

  @Query(() => Event)
  getEventById(
    @Args('id') id: number,
    @Args('originId') originId: string,
  ) {
    return this.eventService.getEventById(id, originId)
  }

  @Query(() => SearchEventPage) autocompleteEvents(
    @Args('input') input: AutocompleteEventsInput,
  ) {
    return this.eventService.autocompleteEvents(input)
  }

  @Query(() => SearchEventPage) searchEvents(
    @Args('input') input: SearchEventsInput,
  ) {
    return this.eventService.searchEvents(input)
  }
}

export default EventResolver
