import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import ormOptions from './configs/orm.config'
import envConfig from './configs/env.config'
import AuthModule from './modules/auth/auth.module'
import GeolocationModule from './modules/geolocation/geolocation.module'
import EventModule from './modules/event/event.module'
import PlaceModule from './modules/place/place.module'
import AuthResolver from './modules/auth/auth.resolver'
import GeolocationResolver from './modules/geolocation/geolocation.resolver'
import EventResolver from './modules/event/event.resolver'
import PlaceResolver from './modules/place/place.resolver'

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
    GeolocationModule,
    EventModule,
    PlaceModule,
  ],
  providers: [
    AuthResolver,
    GeolocationResolver,
    EventResolver,
    PlaceResolver,
  ],
})

export class AppModule {}
