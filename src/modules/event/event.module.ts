import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { EventEntity } from 'src/entities/event.entity'
import { UploadModule } from '../upload/upload.module'
import { FileEntity } from 'src/entities/file.entity'
import { PlaceModule } from '../place/place.module'
import { GeolocationModule } from '../geolocation/geolocation.module'

@Module({
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EventEntity,
      FileEntity,
    ]),
    UploadModule,
    PlaceModule,
    GeolocationModule,
  ],
  exports: [EventService],
})
export class EventModule {}
