import type { VNode } from 'vue'
import type { Sticky, TextAlign } from './constants'
import type { RowItem, RowKey } from './rows'

export type DataTableColumnProps = {
  title?: string
  field?: string
  value?: (row: unknown) => unknown
  searchable?: boolean
  sortable?: boolean
  sortField?: string
  width?: string
  textAlign?: TextAlign
  sticky?: Sticky
  textOverflow?: 'wrap' | 'ellipsis'
  headerTextOverflow?: 'wrap' | 'ellipsis'
}

export type HeaderSlotProps = {
  title: string
}

export type CellSlotProps<T = RowItem> = {
  item: T
  key: RowKey
  index: number
  number: number
}

export type DataTableColumnSlots<T = RowItem> = {
  cell?: (props: CellSlotProps<T>) => VNode[]
  header?: (props: HeaderSlotProps) => VNode[]
}
