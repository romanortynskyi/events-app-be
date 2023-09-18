import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import Axios from 'axios'

import EventInput from './inputs/event.input'
import { UserEntity } from 'src/entities/user.entity'
import { EventEntity } from 'src/entities/event.entity'
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from 'src/enums/error-messages'
import { UploadService } from '../upload/upload.service'
import Folder from 'src/enums/folder.enum'
import { FileEntity } from 'src/entities/file.entity'
import FileProvider from 'src/enums/file-provider.enum'
import EventPage from 'src/models/event-page'
import { ConfigService } from '@nestjs/config'
import { instanceToPlain } from 'class-transformer'
import { PlaceService } from '../place/place.service'
import { GeolocationService } from '../geolocation/geolocation.service'

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

    const imageUploadResponse = await this.uploadService.uploadFile(
      image,
      Folder.EventImages,
      () => {},
    )

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const imageEntity = queryRunner
        .manager
        .getRepository(FileEntity)
        .create({
          src: imageUploadResponse.Location,
          filename: imageUploadResponse.Key,
          provider: FileProvider.Custom,
        })

      await queryRunner.manager.save(imageEntity)

      const eventEntity: EventEntity = queryRunner.manager.getRepository(EventEntity).create({
        title,
        description,
        startDate: new Date(startDateStr),
        endDate: new Date(endDateStr),
        ticketPrice,
        placeId,
        image: imageEntity,
        author: user,
      })

      await queryRunner.manager.save(eventEntity)

      await queryRunner.commitTransaction()

      return eventEntity
    }

    catch (error) {
      console.error(error)
      await queryRunner.rollbackTransaction()

      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR)
    }
  }

  async getEvents({ skip, limit }): Promise<EventPage> {
    const eventsFromDb = await this.eventRepository
      .query(`
          SELECT "event"."id" AS "id", 
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
            "image"."provider" AS "image_provider" 
            FROM "event" "event" 
            INNER JOIN "file" "image" ON "image"."id"="event"."imageId" 
          ORDER BY 
          "startDate" ASC, 
          "id" ASC 
          OFFSET $1
          LIMIT $2 
        `,
        [skip, limit],
      )
      
    const events = await Promise.all(eventsFromDb.map(async (eventFromDb) => {
      const parsedEvent = this.parseEvent(eventFromDb)
      
      const place = await this.placeService.getPlaceById(parsedEvent.placeId)

      const event = {
        ...parsedEvent,
        place: {
          ...place,
          country: this.geolocationService.getCountry(place.address_components),
          locality: this.geolocationService.getLocality(place.address_components),
        },
      }

      return event
    }))
    
    const totalEventsCount = await this.eventRepository.count()
    const totalPagesCount = Math.ceil(totalEventsCount / limit)

    return {
      items: events,
      totalPagesCount,
    }
  }
}
