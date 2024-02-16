import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'

import GetPlaceByIdParams from './types/interfaces/get-place-by-id-params.interface'
import GooglePlace from 'src/models/google-place'

@Injectable()
export class GooglePlacesApiService {
  constructor(private readonly configService: ConfigService) {}

  async getPlaceById(params: GetPlaceByIdParams): Promise<GooglePlace> {
    const { id, fields, language } = params

    const { data } = await Axios.get(
      `https://places.googleapis.com/v1/places/${id}`,
      {
        params: {
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
          fields,
          languageCode: language,
        },
      },
    )

    return {
      ...data,
      originalId: data.id,
    }
  }
}
