import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Point } from 'geojson'
import * as wkx from 'wkx'

import EventInput from './inputs/event.input'
import { UserEntity } from 'src/entities/user.entity'
import { EventEntity } from 'src/entities/event.entity'
import {
  EVENT_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND,
} from 'src/enums/error-messages'
import { UploadService } from '../upload/upload.service'
import Folder from 'src/enums/folder.enum'
import { FileEntity } from 'src/entities/file.entity'
import FileProvider from 'src/enums/file-provider.enum'
import EventPage from 'src/models/event-page'
import { PlaceService } from '../place/place.service'
import { GeolocationService } from '../geolocation/geolocation.service'
import { DistanceMatrixService } from '../distance-matrix/distance-matrix.service'
import { OpenSearchService } from '../open-search/open-search.service'
import OpenSearchIndex from 'src/enums/open-search-index.enum'
import AutocompleteEventsInput from './inputs/autocomplete-events.input'
import SearchEventsInput from './inputs/search-events.input'
import parseOpenSearchEventResponse from 'src/utils/parse-open-search-event-response'
import { PointService } from '../point/point.service'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly uploadService: UploadService,
    private readonly dataSource: DataSource,
    private readonly placeService: PlaceService,
    private readonly geolocationService: GeolocationService,
    private readonly distanceMatrixService: DistanceMatrixService,
    private readonly openSearchService: OpenSearchService,
    private readonly pointService: PointService,
  ) {}

  parseEvent(event) {
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
    }
  }

  async addEvent(input: EventInput, userId: number) {
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

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const place = await this.placeService.getPlaceById(placeId)

      const { lng, lat } = place.geometry.location

      const imageUploadResponse = await this.uploadService.uploadFile(
        image,
        Folder.EventImages,
        () => {},
      )

      const imageEntity = queryRunner
        .manager
        .getRepository(FileEntity)
        .create({
          src: imageUploadResponse.Location,
          filename: imageUploadResponse.Key,
          provider: FileProvider.Custom,
        })

      await queryRunner.manager.save(imageEntity)

      const geolocation: Point = this.pointService.createPoint(lng, lat)

      const eventEntity: EventEntity = queryRunner.manager.getRepository(EventEntity).create({
        title,
        description,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
        ticketPrice,
        placeId,
        geolocation,
        image: imageEntity,
        author: user,
      })

      await queryRunner.manager.save(eventEntity)

      await queryRunner.commitTransaction()

      await this.openSearchService.index(OpenSearchIndex.Events, eventEntity)

      return {
        ...eventEntity,
        geolocation: {
          lng,
          lat,
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
        whereSql = `WHERE ST_Within(geolocation::geometry, ST_MakeEnvelope($3, $4, $5, $6, 4326))`
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
        whereSql = `WHERE ST_Within(geolocation::geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))`
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

    const eventsFromDb = await this.eventRepository
      .query(`
          SELECT event.id AS id, 
            "event"."createdAt" AS "createdAt", 
            "event"."updatedAt" AS "updatedAt", 
            "event"."placeId" AS "placeId", 
            "event"."geolocation" AS "geolocation",
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
            "image"."provider" AS "image_provider" 
          FROM "event" "event" 
          INNER JOIN "file" "image" ON "image"."id"="event"."imageId"
          ${whereSql}
          ORDER BY
            "startDate" ASC,
            "id" ASC
          ${paginationSql}
        `,
        params,
      )

    const events = await Promise.all(eventsFromDb.map(async (eventFromDb) => {
      const parsedEvent = this.parseEvent(eventFromDb)
      const place = await this.placeService.getPlaceById(parsedEvent.placeId)
      
      const geolocation = wkx.Geometry.parse(Buffer.from(eventFromDb.geolocation, 'hex'))
      const [lng, lat] = geolocation.toGeoJSON()['coordinates']

      const event = {
        ...parsedEvent,
        geolocation: {
          lng,
          lat,
        },
        place: {
          ...place,
          country: this.geolocationService.getCountry(place.address_components),
          locality: this.geolocationService.getLocality(place.address_components),
        },
      }

      return event
    }))
    
    const totalEventsCount = await this.eventRepository.count()
    let totalPagesCount = 1

    if (limit) {
      totalPagesCount = Math.ceil(totalEventsCount / limit)
    }

    return {
      items: events,
      totalPagesCount,
    }
  }

  async getEventById(id: number, originId: string) {
    const event = await this.eventRepository
      .findOne({
        where: {
          id,
        },
        relations: {
          image: true,
          author: true,
        },
      })

    if (!event) {
      throw new NotFoundException(EVENT_NOT_FOUND)
    }

    const place = await this.placeService.getPlaceById(event.placeId)

    const distance = await this.distanceMatrixService.getDistance({
      origin: originId,
      destination: event.placeId,
    })

    const [lng, lat] = event.geolocation.coordinates

    return {
      ...event,
      geolocation: {
        lng,
        lat,
      },
      place: {
        ...place,
        country: this.geolocationService.getCountry(place.address_components),
        locality: this.geolocationService.getLocality(place.address_components),
      },
      distance,
    }
  }

  async autocompleteEvents(input: AutocompleteEventsInput) {
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
    const events = result.hits
      .map((hit) => hit._source)
      .map((event) => parseOpenSearchEventResponse(event))
      .map(async (event) => {
        const place = await this.placeService.getPlaceById(event.placeId)

        return {
          ...event,
          place: {
            ...place,
            country: this.geolocationService.getCountry(place.address_components),
            locality: this.geolocationService.getLocality(place.address_components),
            geometry: place.geometry,
          },
        }
      })

    const totalCount = result.total.value
    const totalPagesCount = Math.ceil(totalCount / limit)

    return {
      items: events,
      totalPagesCount,
    }
  }
}
