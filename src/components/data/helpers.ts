export const formatSearchString = (v: unknown): string => {
  if (v === null || v === undefined) {
    return ''
  }

  return String(v).toLowerCase()
}

export const makeSnapshot = (value: any): string => {
  const seen = new WeakSet<object>()

  const snap = (x: unknown): string => {
    if (x === null || x === undefined) {
      return ''
    }

    if (typeof x !== 'object') {
      const type = typeof x
      return `${type}(${JSON.stringify(x)})`
    }

    if (Array.isArray(x)) {
      return `arr[${x.map(snap).join('|')}]`
    }

    const obj = x as Record<string, unknown>

    if (seen.has(obj)) {
      return '[cycle ref]'
    }

    seen.add(obj)

    const params = Object.keys(obj)
      .sort()
      .map((key) => `${key}:${snap(obj[key])}`)

    return `obj(${params.join('|')})`
  }

  return snap(value)
}
