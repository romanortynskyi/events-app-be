import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { PubSub } from 'graphql-subscriptions'

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
import CategoryTranslationModule from './modules/category-translation/category-translation.module'
import CategoryTranslationResolver from './modules/category-translation/category-translation.resolver'
import CategoryModule from './modules/category/category.module'
import CategoryResolver from './modules/category/category.resolver'
import { PubSubModule } from './modules/pub-sub/pub-sub.module'

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      uploads: false,
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
    }),
    TypeOrmModule.forRootAsync(ormOptions),
    AuthModule,
    GeolocationModule,
    EventModule,
    PlaceModule,
    CategoryModule,
    CategoryTranslationModule,
    PubSubModule,
  ],
  providers: [
    AuthResolver,
    GeolocationResolver,
    EventResolver,
    PlaceResolver,
    CategoryResolver,
    CategoryTranslationResolver,
    PubSub,
  ],
})

export class AppModule {}
