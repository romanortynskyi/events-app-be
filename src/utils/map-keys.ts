const mapKeys = (obj, keys, callback) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (keys.includes(Object.keys(obj)[0])) {
    return {...obj, [Object.keys(obj)[0]]: callback(obj[Object.keys(obj)[0]])}
  }

  return Object.fromEntries (
    Object.entries(obj)
      .map(([key, value]) => [key, mapKeys(value, keys, callback)])
  )
}

export default mapKeys
