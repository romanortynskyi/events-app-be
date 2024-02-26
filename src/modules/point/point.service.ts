import { Injectable } from '@nestjs/common'
import { Point } from 'geojson'

@Injectable()
class PointService {
  createPoint(longitude: number, latitude: number): Point {
    return {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
  }

  parsePoint(point) {
    const [longitude, latitude] = point.coordinates

    return {
      longitude,
      latitude,
    }
  }
}

export default PointService

