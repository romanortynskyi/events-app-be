import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Type } from '@nestjs/common'

export default function Paginated<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @Field(() => [ItemType])
    items: T[]

    @Field(() => Int)
    totalPagesCount: number
  }

  return PageClass
}