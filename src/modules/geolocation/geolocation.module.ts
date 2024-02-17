import { Module } from '@nestjs/common'

import GeolocationService from './geolocation.service'

@Module({
  providers: [GeolocationService],
  exports: [GeolocationService],
})
class GeolocationModule {}

export default GeolocationModule
