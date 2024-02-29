import {
  Resolver,
  Mutation,
  Args,
  Query,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { JwtGuard } from '../auth/guards'
import CategoryService from './category.service'
import Category from 'src/models/category'
import CategoryInput from './inputs/category.input'

@Resolver(Category)
class CategoryResolver {
  constructor(private categoryService: CategoryService) {}
  
  @Mutation(() => Category)
  @UseGuards(JwtGuard)
  addCategory(@Args('input') input: CategoryInput): Promise<Category> {
    return this.categoryService.addCategory(input)
  }

  @Query(() => [Category])
  getCategories() {
    return this.categoryService.getCategories()
  }

  @Query(() => Category)
  getCategoryById(@Args('id') id: number) {
    return this.categoryService.getCategoryById()
  }
}

export default CategoryResolver
