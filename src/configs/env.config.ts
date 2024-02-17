import { ConfigModuleOptions } from '@nestjs/config'

const envConfig: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env.local',
}

export default envConfig

