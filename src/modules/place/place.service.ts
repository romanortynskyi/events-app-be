import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'
import AutocompletePlacesInput from './inputs/autocomplete-places.input'
import parsePythonCaseObject from 'src/utils/parse-python-case-object'

@Injectable()
export class PlaceService {
  constructor(private readonly configService: ConfigService) {}

  async getPlaceById(id: string) {
    const { data } = await Axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: id,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      },
    )

    return data.result
  }

  async autocompletePlaces(input: AutocompletePlacesInput, language: string) {
    const {
      skip,
      limit,
      query,
    } = input

    const { data } = await Axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: query,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
          language,
        },
      },
    )
console.log(JSON.stringify(data.predictions[0], null, 2))
    const { predictions } = data

    const items = predictions
      .slice(skip, limit)
      .map((prediction) => parsePythonCaseObject(prediction))

    const totalPagesCount = Math.ceil(predictions.length / limit)
    
    return {
      items,
      totalPagesCount,
    }
  }
}
