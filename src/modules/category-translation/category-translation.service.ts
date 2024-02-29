import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryRunner, Repository } from 'typeorm'

import CheckIfCategoryTranslationExistsInput from './inputs/check-if-category-translation-exists.input'
import CategoryTranslationEntity from 'src/entities/category-translation.entity'

@Injectable()
class CategoryTranslationService {
  constructor(
    @InjectRepository(CategoryTranslationEntity)
    private readonly categoryTranslationRepository: Repository<CategoryTranslationEntity>,
  ) {}

  async checkIfCategoryTranslationExists(
    input: CheckIfCategoryTranslationExistsInput,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const { name, language } = input

    if (queryRunner) {
      const categoryTranslationExists = await queryRunner.manager.exists(
        CategoryTranslationEntity,
        {
          where: {
            name,
            language,
          },
        },
      )
      
      return categoryTranslationExists
    }

    const categoryTranslationExists = await this.categoryTranslationRepository.exist({
      where: {
        name,
        language,
      },
    })

    return categoryTranslationExists
  }
}

export default CategoryTranslationService
