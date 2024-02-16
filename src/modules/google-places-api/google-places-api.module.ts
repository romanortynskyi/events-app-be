import { Module } from '@nestjs/common'

import { GooglePlacesApiService } from './google-places-api.service'

@Module({
  providers: [GooglePlacesApiService],
  exports: [GooglePlacesApiService],
})
export class GooglePlacesApiModule {}
