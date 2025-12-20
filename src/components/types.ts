import { VNode } from 'vue'
import { DataTableProps } from './DataTable.vue'
import { DataTableColumnProps } from './DataTableColumn.vue'

/**
 * Shared
 */
export type ValueOf<T> = T[keyof T]
export type Branded<Type, Brand> = Type & { readonly __brand: Brand }

/**
 * Slots
 */
export type SlotResult = VNode | VNode[] | null | undefined
export type SlotFn<Props = any> = (props?: Props) => SlotResult

export type Slots = {
  default?: SlotFn
  [name: string]: SlotFn | undefined
}

/**
 * Component props
 */
export type TableProps = DataTableProps
export type TableColumnProps = DataTableColumnProps

/**
 * Enums
 */
export const TextAlign = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const
export type TextAlign = ValueOf<typeof TextAlign>

export const Source = {
  LOCAL: 'local',
  REMOTE: 'remote',
} as const
export type Source = ValueOf<typeof Source>

export const Method = {
  GET: 'GET',
  POST: 'POST',
} as const
export type Method = ValueOf<typeof Method>

export const OrderDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const
export type OrderDirection = ValueOf<typeof OrderDirection>

export const Sticky = {
  LEFT: 'left',
  RIGHT: 'right',
} as const
export type Sticky = ValueOf<typeof Sticky>
