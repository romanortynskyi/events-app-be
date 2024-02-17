import { Resolver, Query, Args, Context } from '@nestjs/graphql'

import GeolocationEntity from '../../entities/geolocation.entity'
import GeolocationService from './geolocation.service'

@Resolver(GeolocationEntity)
class GeolocationResolver {
  constructor(private geolocationService: GeolocationService) {}

  @Query(() => GeolocationEntity)
  getGeolocationByCoords(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Context() context,
  ) {
    return this.geolocationService.getGeolocationByCoords({
      latitude,
      longitude,
      language: context.req.headers['accept-language'],
    })
  }
}

export default GeolocationResolver
