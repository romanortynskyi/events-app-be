import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm'

import BaseEntity from './base.entity'
import UserEntity from './user.entity'
import FileEntity from './file.entity'
import PlaceEntity from './place.entity'
import CategoryEntity from './category.entity'

@ObjectType()
@Entity('event')
class EventEntity extends BaseEntity {
  @ManyToOne(() => PlaceEntity, (place) => place.events)
  place: PlaceEntity

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

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.events)
  author: UserEntity

  @ManyToOne(() => FileEntity)
  image: FileEntity

  @ManyToMany(
    () => CategoryEntity,
    (category: CategoryEntity) => category.events,
  )
  @JoinTable({ name: 'event-category' })
  categories: CategoryEntity[]
}

export default EventEntity
