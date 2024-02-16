import mapKeys from './map-keys'
import snakeToCamel from './snake-to-camel'

const parsePythonCaseObject = (obj: any): any => mapKeys(obj, snakeToCamel)

export default parsePythonCaseObject
