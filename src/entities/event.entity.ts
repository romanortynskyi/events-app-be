import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm'
import { Point } from 'geojson'

import BaseEntity from './base.entity'
import UserEntity from './user.entity'
import FileEntity from './file.entity'
import PlaceEntity from './place.entity'

@ObjectType()
@Entity('event')
class EventEntity extends BaseEntity {
  @ManyToOne(() => PlaceEntity, (place) => place.events)
  place: PlaceEntity

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geolocation: Point

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  description: string

  @Field()
  @Column({ type: 'timestamptz', nullable: false })
  startDate: Date

  @Column({ type: 'timestamptz', nullable: false })
  endDate: Date

  @Column({ type: 'decimal' })
  ticketPrice: number

  @ManyToOne(() => UserEntity, (user) => user.events)
  author: UserEntity

  @ManyToOne(() => FileEntity)
  image: FileEntity
}

export default EventEntity
