import { Field, ObjectType } from '@nestjs/graphql'

import File from './file'
import Model from './model'

@ObjectType()
class User extends Model {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field({ nullable: true })
  recoveryCode?: string

  @Field(() => File)
  image: File
}

export default User
