import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

import { UserEntity } from './src/entities/user.entity'
import { FileEntity } from './src/entities/file.entity'
import { EventEntity } from './src/entities/event.entity'
import AddUserEntity1693680054416 from './migrations/1693680054416-add-user-entity'
import AddFileEntity1693721031439 from './migrations/1693721031439-add-file-entity'
import AddUserImage1694070673927 from './migrations/1694070673927-add-user-image'
import AddEventEntity1694960352936 from './migrations/1694960352936-add-event-entity'

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
  ],
  migrations: [
    AddUserEntity1693680054416,
    AddFileEntity1693721031439,
    AddUserImage1694070673927,
    AddEventEntity1694960352936,
  ],
})
