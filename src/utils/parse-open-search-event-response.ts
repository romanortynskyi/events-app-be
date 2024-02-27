import mapValues from './map-values'
import SearchEventResult from 'src/models/search-event-result'

const parseOpenSearchEventResponse = (response): SearchEventResult => {
  const keys = [
    'createdAt',
    'updatedAt',
    'startDate',
    'endDate',
  ]

  const fn = (value) => new Date(value)
  
  const result = mapValues(response, keys, fn)

  return result
}

export default parseOpenSearchEventResponse
