import { Module } from '@nestjs/common'
import { EventService } from './event.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/entities/user.entity'
import { EventEntity } from 'src/entities/event.entity'
import { UploadModule } from '../upload/upload.module'
import { FileEntity } from 'src/entities/file.entity'
import { PlaceModule } from '../place/place.module'
import { GeolocationModule } from '../geolocation/geolocation.module'
import { DistanceMatrixModule } from '../distance-matrix/distance-matrix.module'
import { OpenSearchModule } from '../open-search/open-search.module'
import { PointModule } from '../point/point.module'

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
    DistanceMatrixModule,
    OpenSearchModule,
    PointModule,
  ],
  exports: [EventService],
})
export class EventModule {}
