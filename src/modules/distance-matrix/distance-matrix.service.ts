import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios from 'axios'

@Injectable()
class DistanceMatrixService {
  constructor(private readonly configService: ConfigService) {}
  
  async getDistance({ origin, destination }): Promise<number> {
    console.log(`origin, destination: ${origin}, ${destination}`)
    const response = await Axios.get(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          origins: `place_id:${origin}`,
          destinations: `place_id:${destination}`,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      }
    )

    console.log(`origin: ${origin.latitude},${origin.longitude}`)
    console.log(`destination: ${destination}`)

    console.log(response.data.rows[0].elements)
  
    return response.data.rows[0].elements[0].distance?.value || 0
  }
}

export default DistanceMatrixService
