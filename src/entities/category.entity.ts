import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm'

import BaseEntity from './base.entity'
import EventEntity from './event.entity'
import CategoryTranslationEntity from './category-translation.entity'

@Entity('category')
class CategoryEntity extends BaseEntity {
  @Column({ default: 0 })
  eventsCount: number

  @OneToMany(
    () => CategoryTranslationEntity,
    (categoryTranslation: CategoryTranslationEntity) => categoryTranslation.category,
  )
  translations: CategoryTranslationEntity[]

  @ManyToMany(() => EventEntity, (event: EventEntity) => event.categories)
  events: EventEntity[]
}

export default CategoryEntity
