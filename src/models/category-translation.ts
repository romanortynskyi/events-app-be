import { Field, ObjectType } from '@nestjs/graphql'

import Model from './model'
import Language from 'src/enums/language.enum'

@ObjectType()
class CategoryTranslation extends Model {
  @Field()
  name: string

  @Field(() => Language)
  language: Language
}

export default CategoryTranslation
