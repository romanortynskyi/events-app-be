import { Resolver, Query, Args } from '@nestjs/graphql'

import CategoryTranslationService from './category-translation.service'
import CheckIfCategoryTranslationExistsInput from './inputs/check-if-category-translation-exists.input'

@Resolver()
class CategoryTranslationResolver {
  constructor(private categoryTranslationService: CategoryTranslationService) {}
  
  @Query(() => Boolean)
  checkIfCategoryTranslationExists(
    @Args('input')
    input: CheckIfCategoryTranslationExistsInput,
  ) {
    return this.categoryTranslationService.checkIfCategoryTranslationExists(
      input,
    )
  }
}

export default CategoryTranslationResolver
