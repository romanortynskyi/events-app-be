import { registerEnumType } from '@nestjs/graphql'

enum Language {
  EN = 'en',
  UK = 'uk',
  ES = 'es',
}

export default Language

registerEnumType(Language, { name: 'Language' })
