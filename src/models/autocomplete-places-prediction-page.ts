import { ObjectType } from '@nestjs/graphql'

import Paginated from './paginated'
import AutocompletePlacesPrediction from './autocomplete-places-prediction'

@ObjectType()
export default class AutocompletePlacesPredictionPage extends Paginated(AutocompletePlacesPrediction) {}
