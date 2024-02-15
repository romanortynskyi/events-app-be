import { Field, ObjectType } from '@nestjs/graphql'

import FileProvider from 'src/enums/file-provider.enum'
import Model from './model'

@ObjectType()
class File extends Model {
  @Field({ nullable: true })
  src?: string

  @Field({ nullable: true })
  filename?: string

  @Field()
  provider: FileProvider
}

export default File
