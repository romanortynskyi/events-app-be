const mapKeys = (obj: any, fn): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeys(item, fn))
  }

  return Object.keys(obj).reduce((acc, key) => {
    const mappedKey = fn(key)
    acc[mappedKey] = mapKeys(obj[key], fn)
    
    return acc
  }, {})
}

export default mapKeys
