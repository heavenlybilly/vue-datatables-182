import type { RowItem, RowKey, RowKeySelector } from '../types'
import { isRowKey } from './row-keys'

export const makeRowKeySelector = (rowKey: RowKeySelector<RowItem>): ((row: RowItem) => RowKey) => {
  if (typeof rowKey !== 'function' && typeof rowKey !== 'string') {
    throw new Error('rowKey must be a field name or a function')
  }

  return (row) => {
    const key: unknown = typeof rowKey === 'function' ? rowKey(row) : row[rowKey]

    if (!isRowKey(key)) {
      throw new Error('rowKey must return a string or a finite number')
    }

    return key
  }
}
