import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'

import Place from 'src/models/place'
import GetPlaceByIdParams from './types/interfaces/get-place-by-id-params.interface'

@Injectable()
export class GooglePlacesApiService {
  constructor(private readonly configService: ConfigService) {}

  async getPlaceById(params: GetPlaceByIdParams): Promise<Place> {
    const { id, fields } = params

    const { data } = await Axios.get(
      `https://places.googleapis.com/v1/places/${id}`,
      {
        params: {
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
          fields,
        },
      },
    )

    return {
      ...data,
      originalId: data.id,
    }
  }
}
