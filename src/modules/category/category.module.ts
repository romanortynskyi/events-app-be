import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import CategoryService from './category.service'
import CategoryEntity from 'src/entities/category.entity'
import CategoryTranslationModule from '../category-translation/category-translation.module'
import RecommendationModule from '../recommendation/recommendation.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
    ]),
    CategoryTranslationModule,
    RecommendationModule,
  ],
  providers: [CategoryService],
  exports: [CategoryService],
})
class CategoryModule {}

export default CategoryModule
