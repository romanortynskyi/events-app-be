import EventEntity from 'src/entities/event.entity'
import mapValues from './map-values'

const parseOpenSearchEventResponse = (response): EventEntity => {
  const keys = [
    'createdAt',
    'updatedAt',
    'startDate',
    'endDate',
  ]

  const fn = (value) => new Date(value)
  
  const result = mapValues(response, keys, fn)

  return result as EventEntity
}

export default parseOpenSearchEventResponse
