import {
  Field,
  InputType,
} from '@nestjs/graphql'

// @ts-ignore
import * as GraphQLUpload from 'graphql-upload/public/GraphQLUpload.js'
import FileUpload from 'src/models/file-upload'

@InputType()
class UpdateUserImageInput {
  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>
}

export default UpdateUserImageInput
