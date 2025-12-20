import { RowItem, RowKey, RowKeySelector } from '../types'

export const clampInt = (n: number, min: number, max: number): number => {
  const v = Math.floor(Number(n))

  if (!Number.isFinite(v)) {
    return min
  }

  return Math.max(min, Math.min(max, v))
}

export const makeRowKeySelector = (rowKey: RowKeySelector<RowItem>): ((row: RowItem) => RowKey) => {
  if (typeof rowKey === 'function') {
    return rowKey
  }

  const field = rowKey
  return (row: RowItem) => (row as any)[field] as RowKey
}
