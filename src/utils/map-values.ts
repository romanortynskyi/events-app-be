const mapValues = (obj, keys, fn) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        mapValues(obj[key], keys, fn)
      }
      
      else if (keys.includes(key)) {
        obj[key] = fn(obj[key])
      }
    }
  }
  
  return obj
}

export default mapValues
