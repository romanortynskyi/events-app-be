import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'

import GeolocationEntity from 'src/entities/geolocation.entity'

@Injectable()
export class GeolocationService {
  constructor(private readonly configService: ConfigService) {}

  getCountry(response): string {
    return response.filter((item) => item.types.includes('country'))[0].long_name
  }

  getLocality(response): string {
    return response.filter((item) => item.types.includes('locality'))[0].long_name
  }

  getRoute(response): string {
    return response.filter((item) => item.types.includes('route'))[0].long_name
  }

  getStreetNumber(response): string {
    const partsWithStreetNumber = response.filter((item) => item.types.includes('street_number'))
    return partsWithStreetNumber.length ? partsWithStreetNumber[0].long_name : null
  }

  async getGeolocationByCoords({ latitude, longitude, language }): Promise<Partial<GeolocationEntity>> {
    const response = await Axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
          language,
        },
      },
    )
    
    return {
      placeId: response.data.results[0].place_id,
      latitude,
      longitude,
      country: this.getCountry(response.data.results[0].address_components),
      locality: this.getLocality(response.data.results[0].address_components),
      route: this.getRoute(response.data.results[0].address_components),
      streetNumber: this.getStreetNumber(response.data.results[0].address_components),
    }
  }
}
