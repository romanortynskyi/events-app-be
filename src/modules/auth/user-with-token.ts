import { Field, ObjectType } from '@nestjs/graphql'
import { UserEntity } from 'src/entities/user.entity'

@ObjectType()
class UserWithToken extends UserEntity {
  @Field()
  token: string
}

export default UserWithToken
