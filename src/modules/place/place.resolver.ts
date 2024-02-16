import { Resolver, Query, Args, Context } from '@nestjs/graphql'

import { PlaceService } from './place.service'
import Place from 'src/models/place'
import AutocompletePlacesInput from './inputs/autocomplete-places.input'
import AutocompletePlacesPredictionPage from 'src/models/autocomplete-places-prediction-page'

@Resolver(Place)
class PlaceResolver {
  constructor(private placeService: PlaceService) {}

  @Query(() => AutocompletePlacesPredictionPage)
  autocompletePlaces(
    @Args('input') input: AutocompletePlacesInput,
    @Context() context,
  ) {
    const language = context.req.headers['accept-language']

    return this.placeService.autocompletePlaces(input, language)
  }
}

export default PlaceResolver
