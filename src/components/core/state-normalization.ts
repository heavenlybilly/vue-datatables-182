import type { RowKey, Sort } from '../../types'

export const positiveInteger = (value: number, fallback: number) =>
  Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback

export const equalKeys = (left: readonly RowKey[], right: readonly RowKey[]) =>
  left.length === right.length &&
  left.every((key, index) => key === right[index] || Object.is(key, right[index]))

export const equalSort = (left: Sort, right: Sort) =>
  left?.by === right?.by && left?.direction === right?.direction

export const normalizeSort = (sort: Sort): Sort => {
  if (!sort || typeof sort.by !== 'string' || !['asc', 'desc'].includes(sort.direction)) {
    return null
  }

  return {
    ...sort,
  }
}
