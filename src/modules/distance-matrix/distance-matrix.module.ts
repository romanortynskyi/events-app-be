import { Module } from '@nestjs/common'

import DistanceMatrixService from './distance-matrix.service'

@Module({
  providers: [DistanceMatrixService],
  exports: [DistanceMatrixService],
})
class DistanceMatrixModule {}

export default DistanceMatrixModule
