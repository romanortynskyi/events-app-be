import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import CategoryTranslationService from './category-translation.service'
import CategoryTranslationEntity from 'src/entities/category-translation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryTranslationEntity])],
  providers: [CategoryTranslationService],
  exports: [CategoryTranslationService],
})
class CategoryTranslationModule {}

export default CategoryTranslationModule
