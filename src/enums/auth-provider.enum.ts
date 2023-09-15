import { registerEnumType } from '@nestjs/graphql'

enum AuthProvider {
  Email = 'email',
  Google = 'google',
  Facebook = 'facebook',
}

export default AuthProvider

registerEnumType(AuthProvider, { name: 'AuthProvider' })
