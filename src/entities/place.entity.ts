import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm'
import { Point } from 'geojson'

import { BaseEntity } from './base.entity'
import Location from '../models/location'
import PlaceTranslationEntity from './place-translation.entity'

@ObjectType()
@Entity('place')
export class PlaceEntity extends BaseEntity {
  @Field()
  @Column({ unique: true })
  originalId: string

  @Field(() => Location, { nullable: true })
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point', 
    srid: 4326,
    nullable: true,
  })
  location: Point

  @Field()
  @Column({ unique: true })
  googleMapsUri: string

  @OneToMany(
    () => PlaceTranslationEntity,
    (placeTranslation) => placeTranslation.place,
  )
  translations: PlaceTranslationEntity[]
}
