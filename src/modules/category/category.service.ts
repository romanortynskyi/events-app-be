import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import CategoryInput from './inputs/category.input'
import CategoryEntity from 'src/entities/category.entity'
import Category from 'src/models/category'
import CategoryTranslationEntity from 'src/entities/category-translation.entity'
import CategoryTranslationService from '../category-translation/category-translation.service'
import {
  CATEGORY_TRANSLATION_EXISTS,
  INTERNAL_SERVER_ERROR,
} from 'src/enums/error-messages'
import RecommendationService from '../recommendation/recommendation.service'

@Injectable()
class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly categoryTranslationService: CategoryTranslationService,
    private readonly dataSource: DataSource,
    private readonly recommendationService: RecommendationService,
  ) {}

  async addCategory(input: CategoryInput): Promise<Category> {
    const { translations } = input

    const categoryTranslationEntities = []

    const queryRunner = this.dataSource.createQueryRunner()
    
    await queryRunner.startTransaction()
    
    try {
      for (const translation of translations) {
        const translationExists = await this.categoryTranslationService.checkIfCategoryTranslationExists(
          translation,
          queryRunner,
        )
  
        if (translationExists) {
          throw new ConflictException(CATEGORY_TRANSLATION_EXISTS)
        }
  
        const { name, language } = translation
  
        const categoryTranslationEntity = new CategoryTranslationEntity()
        categoryTranslationEntity.name = name
        categoryTranslationEntity.language = language
  
        await queryRunner.manager.save(categoryTranslationEntity)
        categoryTranslationEntities.push(categoryTranslationEntity)
      }
  
      const categoryEntity = new CategoryEntity()
      categoryEntity.translations = categoryTranslationEntities
  
      await queryRunner.manager.save(categoryEntity)

      await this.recommendationService.addCategory(categoryEntity)

      await queryRunner.commitTransaction()

      return {
        ...categoryEntity,
        translations: categoryTranslationEntities,
        events: [],
      }
    }
  
    catch(e) {
      if (e instanceof ConflictException) {
        throw e
      }

      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR)
    }
  }

  async getCategories() {}

  async getCategoryById() {}
}

export default CategoryService
