export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

export const assertJsonValue = (value: unknown, name: string): void => {
  const ancestors = new Set<object>()

  const visit = (current: unknown): void => {
    if (current === null || typeof current === 'string' || typeof current === 'boolean') {
      return
    }

    if (typeof current === 'number' && Number.isFinite(current)) {
      return
    }

    if (!Array.isArray(current) && !isPlainObject(current)) {
      throw new Error(`${name} must contain only JSON-compatible values`)
    }

    if (ancestors.has(current)) {
      throw new Error(`${name} must not contain cycles`)
    }

    ancestors.add(current)

    if (Array.isArray(current)) {
      for (let index = 0; index < current.length; index += 1) {
        visit(current[index])
      }
    } else {
      Object.values(current).forEach(visit)
    }

    ancestors.delete(current)
  }

  visit(value)
}
