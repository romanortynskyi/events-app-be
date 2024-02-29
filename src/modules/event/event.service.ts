import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import * as wkx from 'wkx'

import EventInput from './inputs/event.input'
import UserEntity from 'src/entities/user.entity'
import EventEntity from 'src/entities/event.entity'
import {
  EVENT_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND,
} from 'src/enums/error-messages'
import UploadService from '../upload/upload.service'
import Folder from 'src/enums/folder.enum'
import FileEntity from 'src/entities/file.entity'
import FileProvider from 'src/enums/file-provider.enum'
import EventPage from 'src/models/event-page'
import PlaceService from '../place/place.service'
import DistanceMatrixService from '../distance-matrix/distance-matrix.service'
import OpenSearchService from '../open-search/open-search.service'
import OpenSearchIndex from 'src/enums/open-search-index.enum'
import AutocompleteEventsInput from './inputs/autocomplete-events.input'
import SearchEventsInput from './inputs/search-events.input'
import parseOpenSearchEventResponse from 'src/utils/parse-open-search-event-response'
import PointService from '../point/point.service'
import Event from 'src/models/event'
import { getObjectWithoutKeys } from 'src/utils/get-object-without-keys'
import FileService from '../file/file.service'
import PlaceEntity from 'src/entities/place.entity'
import SearchEventPage from 'src/models/search-event-page'
import SearchEventResult from 'src/models/search-event-result'
import parseHighlight from 'src/utils/parse-highlight'

@Injectable()
class EventService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
    private readonly placeService: PlaceService,
    private readonly distanceMatrixService: DistanceMatrixService,
    private readonly openSearchService: OpenSearchService,
    private readonly pointService: PointService,
    private readonly fileService: FileService,
  ) {}

  parseEvent(event) {
    const placeGeometry = wkx.Geometry.parse(
      Buffer.from(event.place_location, 'hex'),
    )
    const [longitude, latitude] = placeGeometry.toGeoJSON()['coordinates']

    return {
      id: event.id,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      placeId: event.placeId,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      ticketPrice: event.ticketPrice,
      authorId: event.authorId,
      imageId: event.imageId,
      image: {
        id: event.image_id,
        createdAt: event.image_createdAt,
        updatedAt: event.image_updatedAt,
        src: event.image_src,
        filename: event.image_filename,
        provider: event.image_provider,
      },
      place: {
        id: event.place_id,
        originalId: event.place_originalId,
        googleMapsUri: event.place_googleMapsUri,
        location: {
          longitude,
          latitude,
        },
      },
    }
  }

  async addEvent(input: EventInput, userId: number): Promise<Event> {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    const {
      title,
      description,
      startDate: startDateStr,
      endDate: endDateStr,
      ticketPrice,
      image,
      placeId,
    } = input

    let isNewPlace = false

    const queryRunner = this.dataSource.createQueryRunner()
    
    await queryRunner.startTransaction()

    try {
      let place = await this.placeService.getPlaceById(placeId)

      if (!place) {
        place = await this.placeService.addPlace(placeId, queryRunner)
        isNewPlace = true
      }

      const { latitude, longitude } = place.location

      const imageUploadResponse = await this.uploadService.uploadFile(
        image,
        Folder.EventImages,
        () => {},
      )

      const imageEntity: FileEntity = queryRunner.manager
        .getRepository(FileEntity)
        .create({
          src: imageUploadResponse.Location,
          filename: imageUploadResponse.Key,
          provider: FileProvider.Custom,
        })

      await queryRunner.manager.save(imageEntity)

      const eventEntity: EventEntity = queryRunner.manager
        .getRepository(EventEntity)
        .create({
          title,
          description,
          startDate: new Date(startDateStr),
          endDate: new Date(endDateStr),
          ticketPrice,
          place: {
            ...place,
            location: this.pointService.createPoint(longitude, latitude),
          },
          image: imageEntity,
          author: user,
        })

      await queryRunner.manager.save(eventEntity)

      await queryRunner.commitTransaction()

      const eventToIndex = {
        ...getObjectWithoutKeys(eventEntity, [
          'author',
          'image',
          'place',
        ]),
        placeId,
        imageId: imageEntity.id,
      }

      await this.openSearchService.index(OpenSearchIndex.Events, eventToIndex)
      
      if (isNewPlace) {
        await this.openSearchService.index(OpenSearchIndex.Places, place)
      }

      return {
        ...eventEntity,
        place: {
          ...place,
          location: {
            latitude,
            longitude,
          },
        },
      }
    }

    catch (error) {
      console.error(error)
      await queryRunner.rollbackTransaction()

      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR)
    }
  }

  async getEvents({
    skip,
    limit,
    bounds,
  }): Promise<EventPage> {
    let whereSql: string = ''
    let paginationSql: string = ''
    let params: any[] = []

    if (bounds) {
      const {
        xMin,
        yMin,
        xMax,
        yMax,
      } = bounds
      
      if (skip && limit) {
        whereSql = `WHERE ST_Within("place"."location"::geometry, ST_MakeEnvelope($3, $4, $5, $6, 4326))`
        paginationSql = `
          OFFSET $1
          LIMIT $2
        `
        params = [
          skip,
          limit,
          xMin,
          yMin,
          xMax,
          yMax,
        ]
      }

      else {
        whereSql = `WHERE ST_Within("place"."location"::geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))`
        params = [
          xMin,
          yMin,
          xMax,
          yMax,
        ]
      }
    }

    else {
      paginationSql = `
        OFFSET $1
        LIMIT $2
      `
      params = [skip, limit]
    }

    const events = await this.eventRepository.query(
      `
        SELECT event.id AS id, 
          "event"."createdAt" AS "createdAt", 
          "event"."updatedAt" AS "updatedAt", 
          "event"."placeId" AS "placeId", 
          "event"."title" AS "title", 
          "event"."description" AS "description", 
          "event"."startDate" AS "startDate", 
          "event"."endDate" AS "endDate", 
          "event"."ticketPrice" AS "ticketPrice", 
          "event"."authorId" AS "authorId", 
          "event"."imageId" AS "imageId", 
          "image"."id" AS "image_id", 
          "image"."createdAt" AS "image_createdAt", 
          "image"."updatedAt" AS "image_updatedAt", 
          "image"."src" AS "image_src", 
          "image"."filename" AS "image_filename", 
          "image"."provider" AS "image_provider",
          "place"."id" AS "place_id",
          "place"."originalId" AS "place_originalId",
          "place"."googleMapsUri" AS "place_googleMapsUri",
          "place"."location" AS "place_location"
        FROM "event" "event" 
        INNER JOIN "file" "image" ON "image"."id" = "event"."imageId"
        INNER JOIN "place" "place" ON "place"."id" = "event"."placeId" 
        ${whereSql}
        ORDER BY
          "startDate" ASC,
          "id" ASC
        ${paginationSql}
      `,
      params,
    )

    const totalEventsCount = await this.eventRepository.count()
    let totalPagesCount = 1

    if (limit) {
      totalPagesCount = Math.ceil(totalEventsCount / limit)
    }

    return {
      items: events.map(this.parseEvent),
      totalPagesCount,
    }
  }

  async getEventById(id: number, originId: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id,
      },
      relations: {
        image: true,
        author: true,
        place: true,
      },
    })

    if (!event) {
      throw new NotFoundException(EVENT_NOT_FOUND)
    }

    const place = await this.placeService.getPlaceById(event.place.originalId)

    const distance = await this.distanceMatrixService.getDistance({
      origin: originId,
      destination: event.place.originalId,
    })

    return {
      ...event,
      place: {
        ...place,
        // country: this.geolocationService.getCountry(place.address_components),
        // locality: this.geolocationService.getLocality(place.address_components),
      },
      distance,
    }
  }

  async autocompleteEvents(
    input: AutocompleteEventsInput,
  ): Promise<SearchEventPage> {
    const {
      query,
      skip,
      limit,
    } = input

    const result = await this.openSearchService.search(
      OpenSearchIndex.Events,
      {
        from: skip,
        size: limit,
        query: {
          match_phrase_prefix: {
            title: {
              query,
            },
          },
        },
        highlight: {
          fields: {
            title: {},
          },
        },
      },
    )

    return this.mapOpenSearchEvents(result, limit)
  }

  async searchEvents(input: SearchEventsInput) {
    const {
      query,
      skip,
      limit,
    } = input

    const result = await this.openSearchService.search(
      OpenSearchIndex.Events,
      {
        from: skip,
        size: limit,
        query: {
          match: {
            title: {
              query,
            },
          },
        },
      },
    )

    return this.mapOpenSearchEvents(result, limit)
  }

  async mapOpenSearchEvents(result, limit) {
    const rawEvents = result.hits.map((hit) => ({
      ...hit._source,
      titleHighlightParts: parseHighlight(hit.highlight?.title[0] || ''),
    }))
    const placeIds = [...new Set(rawEvents.map((event) => event.placeId))]

    const places = await this.placeRepository
      .createQueryBuilder('place')
      .where('"originalId" IN(:ids)', { ids: placeIds.join(',') })
      .getMany()
    
    const events = await Promise.all(
      rawEvents
        .map((event) => parseOpenSearchEventResponse(event))
        .map(async (event) => {
          const place = places.filter(
            (place: PlaceEntity) => place.originalId === event.placeId
          )[0]
          const image = await this.fileService.getFileById(event.imageId)

          return {
            ...event,
            image,
            place: {
              ...place,
              location: this.pointService.parsePoint(place.location)
              // country: this.geolocationService.getCountry(place.address_components),
              // locality: this.geolocationService.getLocality(place.address_components),
              // geometry: place.geometry,
            },
          }
        })
      )

    const totalCount = result.total.value
    const totalPagesCount = Math.ceil(totalCount / limit)

    return {
      items: events,
      totalPagesCount,
    }
  }
}

export default EventService
