import { ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm'

import BaseEntity from './base.entity'
import PlaceEntity from './place.entity'

@ObjectType()
@Entity('place-translation')
class PlaceTranslationEntity extends BaseEntity {
  @Column()
  language: string

  @Column()
  name: string

  @Column()
  country: string

  @Column()
  locality: string

  @Column()
  route: string

  @Column()
  streetNumber: string

  @ManyToOne(() => PlaceEntity, (place) => place.translations)
  place: string
}

export default PlaceTranslationEntity