import { Injectable } from '@nestjs/common'
import { Point } from 'geojson'

@Injectable()
export class PointService {
  createPoint(longitude: number, latitude: number): Point {
    return {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
  }
}
