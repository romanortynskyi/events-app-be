import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import EventService from './event.service'
import UserEntity from 'src/entities/user.entity'
import EventEntity from 'src/entities/event.entity'
import FileEntity from 'src/entities/file.entity'
import UploadModule from '../upload/upload.module'
import PlaceModule from '../place/place.module'
import GeolocationModule from '../geolocation/geolocation.module'
import DistanceMatrixModule from '../distance-matrix/distance-matrix.module'
import OpenSearchModule from '../open-search/open-search.module'
import PointModule from '../point/point.module'
import FileModule from '../file/file.module'

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
    FileModule,
  ],
  exports: [EventService],
})
class EventModule {}

export default EventModule
