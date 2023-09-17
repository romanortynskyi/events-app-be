import { Column, Entity, ManyToOne } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from './base.entity'
import { UserEntity } from './user.entity'
import { FileEntity } from './file.entity'

@ObjectType()
@Entity('event')
export class EventEntity extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  placeId: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  title: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string

  @Field()
  @Column({ type: 'timestamptz', nullable: false })
  startDate: Date

  @Field()
  @Column({ type: 'timestamptz', nullable: false })
  endDate: Date

  @Field()
  @Column({ type: 'decimal' })
  ticketPrice: number

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.events)
  author: UserEntity

  @Field(() => FileEntity)
  @ManyToOne(() => FileEntity)
  image: FileEntity
}
