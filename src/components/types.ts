import { VNode } from 'vue'
import { DataTableProps } from './DataTable.vue'
import { DataTableColumnProps } from './DataTableColumn.vue'

/**
 * Shared
 */
export type ValueOf<T> = T[keyof T]
export type Branded<Type, Brand> = Type & { readonly __brand: Brand }

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
  get: 'get',
  post: 'post',
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
 * Table types
 */
export type RowValue = any
export type RowKey = string | number
export type RowKeySelector<T> = (keyof T & string) | ((item: T) => RowKey)
export type RowItem = Record<string, RowValue>

/**
 * Request adapter
 */
export type RequestContext = {
  url: string
  method: Method
  query: {
    page?: number
    perPage?: number
    search?: string
    orderBy?: string
    orderDirection?: OrderDirection
    filter?: Record<string, unknown>
  }
}

export type BuiltRequest = {
  url: string
  method: Method
  headers?: Record<string, string>
  query?: Record<string, string | number | boolean | null | undefined>
  body?: any
}

export type RequestAdapter = (context: RequestContext) => BuiltRequest

/**
 * Response adapter
 */
export type ResponseAdapter<TRowItem = RowItem> = (response: any) => {
  items: TRowItem[]
  total: number
  filtered?: number
}

/**
 * Emit payloads
 */
export type RequestStartPayload = {
  url: string
  method: Method
  query?: BuiltRequest['query']
  body?: any
}

export type RequestEndPayload = {
  ok: boolean
}

export type RequestErrorPayload = {
  error: unknown
}

export type RequestSuccessPayload<TRowItem = RowItem> = {
  items: TRowItem[]
  total: number
  filtered?: number
}

export type SelectedKeysChangePayload<TRowItem = RowItem> = {
  keys: RowKey[]
  items: TRowItem[]
}

export type RowClickPayload<TRowItem = RowItem> = {
  key: RowKey
  item: TRowItem
}
