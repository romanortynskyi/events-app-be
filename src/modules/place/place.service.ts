import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'
import Place from 'src/models/place'

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
}
