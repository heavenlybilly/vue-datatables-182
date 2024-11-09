// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'

/**
 * Columns
 */
export type DTColumnProps = {
  field: string
  title: string | null
  orderable: boolean
  searchable: boolean
  width: string | null
}
export type DTColumn = {
  index: number
  params: {
    field: string
    title: string | null
    orderable: boolean
    searchable: boolean
  }
  slots: {
    cell: NormalizedScopedSlot | undefined
    filter: NormalizedScopedSlot | undefined
  }
  appearance: {
    width: string | null
    classObject: Record<string, boolean>
  }
}

/**
 * Table data
 */
export type DTDataSource = 'server' | 'client'

export type DTRowItemValue = string | number | boolean | null
export type DTRowItem = Record<string, DTRowItemValue>
export type DTRow = {
  index: number
  number: number
  item: DTRowItem
}

export type DTTableData = {
  total: number
  filtered: number
  rows: DTRow[]
}

/**
 * Order
 */
export type DTOrderDirection = 'asc' | 'desc'
export type DTOrderColumn = {
  column: string
  direction: DTOrderDirection
}
export type DTOrder = DTOrderColumn
