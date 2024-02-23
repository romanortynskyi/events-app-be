import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

import UserEntity from './src/entities/user.entity'
import FileEntity from './src/entities/file.entity'
import EventEntity from './src/entities/event.entity'
import PlaceEntity from './src/entities/place.entity'
import PlaceTranslationEntity from './src/entities/place-translation.entity'
import AddUserEntity1693680054416 from './migrations/1693680054416-add-user-entity'
import AddFileEntity1693721031439 from './migrations/1693721031439-add-file-entity'
import AddUserImage1694070673927 from './migrations/1694070673927-add-user-image'
import AddEventEntity1694960352936 from './migrations/1694960352936-add-event-entity'
import AddEventGeolocation1704812235974 from './migrations/1704812235974-add-event-geolocation'
import AddPlaceEntity1708032193434 from './migrations/1708028281000-add-place-entity'
import AddPlaceLocation1708028281541 from './migrations/1708028281541-add-place-location'
import AddPlaceTranslation1708039137615 from './migrations/1708039137615-add-place-translation'
import AddEventPlace1708700312026 from './migrations/1708700312026-add-event-place'

config({
  path: '.env.local',
})

const configService = new ConfigService()

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [
    UserEntity,
    FileEntity,
    EventEntity,
    PlaceEntity,
    PlaceTranslationEntity,
  ],
  migrations: [
    AddUserEntity1693680054416,
    AddFileEntity1693721031439,
    AddUserImage1694070673927,
    AddEventEntity1694960352936,
    AddEventGeolocation1704812235974,
    AddPlaceEntity1708032193434,
    AddPlaceLocation1708028281541,
    AddPlaceTranslation1708039137615,
    AddEventPlace1708700312026,
  ],
})
