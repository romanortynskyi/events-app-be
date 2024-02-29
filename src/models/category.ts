import { Field, ObjectType } from '@nestjs/graphql'

import Event from './event'
import Model from './model'
import CategoryTranslation from './category-translation'

@ObjectType()
class Category extends Model {
  @Field(() => [CategoryTranslation], { nullable: false })
  translations: CategoryTranslation[]

  @Field()
  eventsCount: number

  @Field(() => [Event])
  events?: Event[]
}

export default Category
