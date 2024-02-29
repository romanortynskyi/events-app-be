import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'

import EventEntity from 'src/entities/event.entity'
import FileEntity from 'src/entities/file.entity'
import PlaceTranslationEntity from 'src/entities/place-translation.entity'
import PlaceEntity from 'src/entities/place.entity'
import UserEntity from 'src/entities/user.entity'
import CategoryEntity from 'src/entities/category.entity'
import CategoryTranslationEntity from 'src/entities/category-translation.entity'

const ormOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: parseInt(configService.get('DATABASE_PORT')),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [
      UserEntity,
      FileEntity,
      EventEntity,
      PlaceEntity,
      PlaceTranslationEntity,
      CategoryEntity,
      CategoryTranslationEntity,
    ],
    logging: true,
  }),
}

export default ormOptions
