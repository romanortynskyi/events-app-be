import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload'

async function bootstrap() {
  const port = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule)

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

  await app.listen(port)
}

bootstrap()
