import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Axios, { AxiosInstance } from 'axios'

@Injectable()
class RecommendationService {
  axiosInstance: AxiosInstance

  constructor(configService: ConfigService) {
    this.axiosInstance = Axios.create({
      baseURL: configService.get('RECOMMENDATION_SERVICE_URL'),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async addCategory(category) {
    const response = await this.axiosInstance.post('/categories', category)

    if (response.status === 201) {
      return response.data
    }

    else {
      throw new InternalServerErrorException(response.data)
    }
  }
}

export default RecommendationService
