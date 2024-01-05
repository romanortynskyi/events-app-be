import { EventEntity } from 'src/entities/event.entity'
import mapKeys from './map-keys'

const parseOpenSearchEventResponse = (response): EventEntity => {
  const keys = [
    'createdAt',
    'updatedAt',
    'startDate',
    'endDate',
  ]
  
  const callback = (value) => new Date(value)
  
  const result = mapKeys(response, keys, callback)

  return result
}

export default parseOpenSearchEventResponse
