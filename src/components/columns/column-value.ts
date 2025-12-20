import type { RowItem } from '../../types'
import type { ColumnDef } from './types'

export const resolveColumnValue = (column: ColumnDef<RowItem>, item: RowItem): unknown => {
  if (column.value) {
    return column.value(item)
  }

  return column.field === undefined ? undefined : item[column.field]
}

export const formatColumnValue = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value)
