import { EventEntity } from 'src/entities/event.entity'
import mapKeys from './map-keys'

const parseOpenSearchEventResponse = (response): EventEntity => {
  const keys = [
    'createdAt',
    'updatedAt',
    'startDate',
    'endDate',
  ]

  const fn = (value) => new Date(value)
  
  const result = mapKeys(response, keys, fn)

  return result as EventEntity
}

export default parseOpenSearchEventResponse
