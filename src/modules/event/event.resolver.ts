import { Resolver, Mutation, Args } from '@nestjs/graphql'
import EventInput from './inputs/event.input'
import { EventService } from './event.service'
import { EventEntity } from 'src/entities/event.entity'
import { CurrentUser } from 'src/decorators/current-user'
import { UserEntity } from 'src/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/guards'

@Resolver(EventEntity)
class EventResolver {
  constructor(private eventService: EventService) {}
  
  @Mutation(() => EventEntity)
  @UseGuards(JwtGuard)
  addEvent(@CurrentUser() user: UserEntity, @Args('input') input: EventInput) {
    return this.eventService.addEvent(input, user.id)
  }
}

export default EventResolver
