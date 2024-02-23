import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm'
import { Point } from 'geojson'

import BaseEntity from './base.entity'
import Location from '../models/location'
import PlaceTranslationEntity from './place-translation.entity'
import EventEntity from './event.entity'

@ObjectType()
@Entity('place')
class PlaceEntity extends BaseEntity {
  @Column({ unique: true })
  originalId: string

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point', 
    srid: 4326,
    nullable: true,
  })
  location: Point

  @Column({ unique: true })
  googleMapsUri: string

  @OneToMany(
    () => PlaceTranslationEntity,
    (placeTranslation) => placeTranslation.place,
  )
  translations: PlaceTranslationEntity[]

  @OneToMany(() => EventEntity, (event) => event.place)
  events: EventEntity[]
}

export default PlaceEntity
