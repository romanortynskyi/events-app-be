import { Module } from '@nestjs/common'

import OpenSearchService from './open-search.service'

@Module({
  providers: [OpenSearchService],
  exports: [OpenSearchService],
})
class OpenSearchModule {}

export default OpenSearchModule
