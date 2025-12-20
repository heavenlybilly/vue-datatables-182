import { formatColumnValue } from '../columns/column-value'

export const formatSearchString = (value: unknown): string => formatColumnValue(value).toLowerCase()

export const makeSnapshot = (value: unknown): string => {
  const canonical = (current: unknown): unknown => {
    if (Array.isArray(current)) {
      return current.map(canonical)
    }

    if (current !== null && typeof current === 'object') {
      return Object.fromEntries(
        Object.entries(current)
          .sort(([a], [b]) => Number(a > b) - Number(a < b))
          .map(([key, item]) => [key, canonical(item)]),
      )
    }

    return current
  }

  return JSON.stringify(canonical(value))
}
