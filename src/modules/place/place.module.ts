import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PlaceService } from './place.service'
import { GooglePlacesApiModule } from '../google-places-api/google-places-api.module'
import { PlaceEntity } from 'src/entities/place.entity'
import { PointModule } from '../point/point.module'

@Module({
  providers: [PlaceService],
  exports: [PlaceService],
  imports: [
    TypeOrmModule.forFeature([PlaceEntity]),
    GooglePlacesApiModule,
    PointModule,
  ],
})
export class PlaceModule {}
