import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import BaseEntity from './base.entity'

@ObjectType()
@Entity('geolocation')
class GeolocationEntity extends BaseEntity {
  @Field({ nullable: false })
  @Column({ nullable: false })
  placeId: string

  @Field({ nullable: false })
  @Column({ nullable: false })
  latitude: number

  @Field({ nullable: false })
  @Column({ nullable: false })
  longitude: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  country: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  locality: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  route: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  streetNumber: string
}

export default GeolocationEntity
