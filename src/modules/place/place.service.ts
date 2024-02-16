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
import GooglePlace from 'src/models/google-place'
import supportedLanguages from 'src/consts/supported-languages'

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
    let place: Place | GooglePlace = await this.getPlaceById(id)

    if (!place) {
      const translations = []

      for (const language of supportedLanguages) {
        place = await this.googlePlacesApiService.getPlaceById({
          id,
          fields: 'id,displayName,location,addressComponents,googleMapsUri,photos',
          language,
        })

        const { addressComponents, displayName } = place

        const country = this.geolocationService.getCountry(addressComponents)
        const locality = this.geolocationService.getLocality(addressComponents)
        const route = this.geolocationService.getRoute(addressComponents)
        const streetNumber = this.geolocationService.getStreetNumber(addressComponents)

        const placeTranslationEntity = new PlaceTranslationEntity()
        placeTranslationEntity.name = displayName.text
        placeTranslationEntity.language = language
        placeTranslationEntity.country = country
        placeTranslationEntity.locality = locality
        placeTranslationEntity.route = route
        placeTranslationEntity.streetNumber = streetNumber
  
        await queryRunner.manager
          .getRepository(PlaceTranslationEntity)
          .save(placeTranslationEntity)
  
        translations.push(placeTranslationEntity)
      }

      const { longitude, latitude } = place.location

      const location: Point = this.pointService.createPoint(
        longitude,
        latitude,
      )

      const { id: originalId, googleMapsUri } = place

      const placeEntity = new PlaceEntity()

      placeEntity.location = location
      placeEntity.originalId = originalId as string
      placeEntity.googleMapsUri = googleMapsUri
      placeEntity.translations = translations

      await queryRunner.manager.getRepository(PlaceEntity).save(placeEntity)

      return {
        ...placeEntity,
        location: {
          longitude,
          latitude,
        },
      }
    }

    return place
  }

  async getPlaceById(id: string): Promise<Place | null> {
    const place = await this.placeRepository.findOneBy({ originalId: id })
    
    if (place) {
      const [longitude, latitude] = place.location.coordinates

      return {
        ...place,
        location: {
          longitude,
          latitude,
        },
      }
    }
  }

  async autocompletePlaces(input: AutocompletePlacesInput, language: string) {
    
  }
}
