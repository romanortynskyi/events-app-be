import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import EventInput from './inputs/event.input'
import { UserEntity } from 'src/entities/user.entity'
import { EventEntity } from 'src/entities/event.entity'
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from 'src/enums/error-messages'
import { UploadService } from '../upload/upload.service'
import Folder from 'src/enums/folder.enum'
import { FileEntity } from 'src/entities/file.entity'
import FileProvider from 'src/enums/file-provider.enum'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly uploadService: UploadService,
    private dataSource: DataSource,
  ) {}

  async addEvent(input: EventInput, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId })

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND)
    }

    const {
      title,
      description,
      startDate,
      endDate,
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
        startDate,
        endDate,
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
}
