import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm'

import BaseEntity from './base.entity'
import CategoryEntity from './category.entity'

@Entity('category-translation')
class CategoryTranslationEntity extends BaseEntity {
  @Column()
  language: string

  @Column()
  name: string

  @ManyToOne(() => CategoryEntity, (category) => category.translations)
  category: CategoryEntity
}

export default CategoryTranslationEntity