import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsString, Length } from 'class-validator'
import Language from 'src/enums/language.enum'

@InputType()
class CategoryTranslationInput {
  @Field(() => String)
  @IsString()
  @Length(1)
  name: string

  @Field(() => Language)
  @IsEnum(Language)
  language: Language
}

export default CategoryTranslationInput
