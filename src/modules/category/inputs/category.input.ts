import { Field, InputType } from '@nestjs/graphql'

import CategoryTranslationInput from './category-translation.input'

@InputType()
class CategoryInput {
  @Field(() => [CategoryTranslationInput])
  translations: CategoryTranslationInput[]
}

export default CategoryInput
