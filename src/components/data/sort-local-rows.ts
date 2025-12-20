import type { RowItem, SortDirection } from '../../types'
import { resolveColumnValue } from '../columns/column-value'
import type { ColumnDef } from '../columns/types'

type SortableValue = string | number | boolean | null | undefined

const sortableValue = (value: unknown, column: string): SortableValue => {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  throw new Error(
    `Column ${column}: local sort requires strings, finite numbers, booleans or null/undefined`,
  )
}

export const sortLocalRows = (
  source: readonly RowItem[],
  filtered: readonly RowItem[],
  column: ColumnDef<RowItem>,
  direction: SortDirection,
): RowItem[] => {
  let valueType: string | undefined
  const entries = source.map((item, index) => {
    const value = sortableValue(resolveColumnValue(column, item), column.key)

    if (value !== null && value !== undefined) {
      const type = typeof value

      if (valueType !== undefined && type !== valueType) {
        throw new Error(`Column ${column.key}: local sort does not support mixed value types`)
      }

      valueType = type
    }

    return {
      item,
      index,
      value,
    }
  })
  const included = new Set(filtered)
  const sign = direction === 'asc' ? 1 : -1

  return entries
    .filter(({ item }) => included.has(item))
    .sort((left, right) => {
      const a = left.value
      const b = right.value

      if (a === null || a === undefined) {
        return b === null || b === undefined ? left.index - right.index : 1
      }

      if (b === null || b === undefined) {
        return -1
      }

      const order =
        typeof a === 'string' && typeof b === 'string'
          ? Number(a > b) - Number(a < b)
          : Number(a) - Number(b)

      return order * sign || left.index - right.index
    })
    .map(({ item }) => item)
}
