import { Module } from '@nestjs/common'

import PointService from './point.service'

@Module({
  providers: [PointService],
  exports: [PointService],
})
class PointModule {}

export default PointModule
