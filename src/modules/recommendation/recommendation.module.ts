import { Module } from '@nestjs/common'

import RecommendationService from './recommendation.service'

@Module({
  providers: [RecommendationService],
  exports: [RecommendationService],
})
class RecommendationModule {}

export default RecommendationModule
