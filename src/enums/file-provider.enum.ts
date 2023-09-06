import { registerEnumType } from '@nestjs/graphql'

enum FileProvider {
  Custom = 'custom',
  Google = 'google',
  Facebook = 'facebook',
}

export default FileProvider

registerEnumType(FileProvider, { name: 'FileProvider' })
