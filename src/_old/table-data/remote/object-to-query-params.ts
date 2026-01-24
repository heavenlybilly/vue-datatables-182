const objectToQueryParams = (obj: Record<string, any> | null, parentKey: string = ''): string => {
  if (obj === null) {
    return ''
  }

  const queryParams: string[] = []

  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const fullKey = parentKey ? `${parentKey}[${key}]` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        queryParams.push(objectToQueryParams(value, fullKey))
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`
          if (typeof item === 'object' && item !== null) {
            queryParams.push(objectToQueryParams(item, arrayKey))
          } else {
            queryParams.push(`${encodeURIComponent(arrayKey)}=${encodeURIComponent(item)}`)
          }
        })
      } else {
        queryParams.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`)
      }
    }
  })

  return queryParams.join('&')
}

export default objectToQueryParams
