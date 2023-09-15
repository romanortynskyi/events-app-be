import { Field, ObjectType } from '@nestjs/graphql'
import { UserEntity } from 'src/entities/user.entity'
import AuthProvider from 'src/enums/auth-provider.enum'

@ObjectType()
class UserWithToken extends UserEntity {
  @Field()
  token: string

  @Field()
  provider: AuthProvider
}

export default UserWithToken
