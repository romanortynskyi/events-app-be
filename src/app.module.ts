import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { ormOptions } from './configs/orm.config'
import { envConfig } from './configs/env.config'
import AuthResolver from './modules/auth/auth.resolver'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      uploads: false,
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRootAsync(ormOptions),
    AuthModule,
  ],
  providers: [
    AuthResolver,
  ],
})

export class AppModule {}
