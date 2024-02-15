import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryRunner, Repository } from 'typeorm'

import AutocompletePlacesInput from './inputs/autocomplete-places.input'
import { PlaceEntity } from 'src/entities/place.entity'
import { GooglePlacesApiService } from '../google-places-api/google-places-api.service'
import Place from 'src/models/place'
import { Point } from 'geojson'
import { PointService } from '../point/point.service'

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
    private readonly googlePlacesApiService: GooglePlacesApiService,
    private readonly pointService: PointService,
  ) {}

  async addPlace(id: string, queryRunner: QueryRunner): Promise<PlaceEntity> {
    let place: PlaceEntity | Place = await this.placeRepository.findOneBy({
      originalId: id,
    })

    if (!place) {
      place = await this.googlePlacesApiService.getPlaceById({
        id,
        fields: 'id,displayName,location,addressComponents,googleMapsUri,photos',
      })

      const { longitude, latitude } = place.location

      const placeEntity = new PlaceEntity()

      const location: Point = this.pointService.createPoint(
        longitude,
        latitude,
      )
      
      placeEntity.location = location
      placeEntity.originalId = place.originalId
      placeEntity.googleMapsUri = place.googleMapsUri

      await queryRunner.manager.getRepository(PlaceEntity).save(placeEntity)

      return placeEntity
    }

    return new PlaceEntity()
  }

  async getPlaceById(id: string) {
    const place = await this.placeRepository.findOneBy({ originalId: id })

    return place
  }

  async autocompletePlaces(input: AutocompletePlacesInput, language: string) {
    
  }
}
