import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryRunner, Repository } from 'typeorm'

import AutocompletePlacesInput from './inputs/autocomplete-places.input'
import { PlaceEntity } from 'src/entities/place.entity'
import { GooglePlacesApiService } from '../google-places-api/google-places-api.service'
import Place from 'src/models/place'
import { Point } from 'geojson'
import { PointService } from '../point/point.service'
import PlaceTranslationEntity from 'src/entities/place-translation.entity'
import { GeolocationService } from '../geolocation/geolocation.service'

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
    private readonly googlePlacesApiService: GooglePlacesApiService,
    private readonly pointService: PointService,
    private readonly geolocationService: GeolocationService,
  ) {}

  async addPlace(id: string, queryRunner: QueryRunner): Promise<Place> {
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

      const {
        originalId,
        googleMapsUri,
        addressComponents,
      } = place

      placeEntity.location = location
      placeEntity.originalId = originalId
      placeEntity.googleMapsUri = googleMapsUri

      const country = this.geolocationService.getCountry(addressComponents)
      const locality = this.geolocationService.getLocality(addressComponents)
      const route = this.geolocationService.getRoute(addressComponents)
      const streetNumber = this.geolocationService.getStreetNumber(addressComponents)

      const placeTranslationEntity = new PlaceTranslationEntity()
      placeTranslationEntity.country = country
      placeTranslationEntity.locality = locality
      placeTranslationEntity.route = route
      placeTranslationEntity.streetNumber = streetNumber

      await queryRunner.manager
        .getRepository(PlaceTranslationEntity)
        .save(placeTranslationEntity)

      placeEntity.translations = [placeTranslationEntity]

      await queryRunner.manager.getRepository(PlaceEntity).save(placeEntity)

      return {
        ...placeEntity,
        location: {
          longitude,
          latitude,
        },
      }
    }

    const [longitude, latitude] = place.location.coordinates

    return {
      ...place,
      location: {
        longitude,
        latitude,
      },
    }
  }

  async getPlaceById(id: string): Promise<Place> {
    const place = await this.placeRepository.findOneBy({ originalId: id })

    const [longitude, latitude] = place.location.coordinates

    return {
      ...place,
      location: {
        longitude,
        latitude,
      },
    }
  }

  async autocompletePlaces(input: AutocompletePlacesInput, language: string) {
    
  }
}
