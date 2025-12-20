import type { ColumnDef } from './types'
import { ColumnKind } from './types'

const processingFields = [
  'key',
  'kind',
  'field',
  'value',
  'searchable',
  'sortable',
  'sortField',
] as const
const appearanceFields = [
  'title',
  'width',
  'sticky',
  'textAlign',
  'className',
  'textOverflow',
  'headerTextOverflow',
] as const

export const equalColumns = <T>(
  left: readonly ColumnDef<T>[],
  right: readonly ColumnDef<T>[],
  processingOnly = false,
): boolean => {
  const previous = processingOnly ? left.filter((column) => column.kind === ColumnKind.DATA) : left
  const current = processingOnly ? right.filter((column) => column.kind === ColumnKind.DATA) : right

  return (
    previous.length === current.length &&
    previous.every((column, index) => {
      const next = current[index]

      if (!processingFields.every((field) => column[field] === next[field])) {
        return false
      }

      return (
        processingOnly ||
        (appearanceFields.every((field) => column[field] === next[field]) &&
          column.slots?.cell === next.slots?.cell &&
          column.slots?.header === next.slots?.header)
      )
    })
  )
}
