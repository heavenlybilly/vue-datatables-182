import { VNode } from 'vue'

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
 * Table types
 */
export type RowValue = any
export type RowKey = string | number
export type RowKeySelector<T> = (keyof T & string) | ((item: T) => RowKey)
export type RowItem = Record<string, RowValue>

/**
 * Table filter
 */
export type TableFilter = Record<string, any>

/**
 * Request adapter
 */
export type RequestContext = {
  url: string
  requestBody: {
    page?: number
    perPage?: number
    search?: string
    orderBy?: string
    orderDirection?: OrderDirection
    filter?: TableFilter
    [key: string]: any
  }
}

export type BuiltRequest = {
  url: string
  headers?: Record<string, string>
  requestBody?: any
}

export type RequestAdapter = (context: RequestContext) => BuiltRequest

/**
 * Response adapter
 */
export type BuiltResponse<TRowItem = RowItem> = {
  items: TRowItem[]
  total: number
  filtered?: number
}

export type ResponseAdapter<TRowItem = RowItem> = (response: any) => BuiltResponse<TRowItem>

/**
 * Emit payloads
 */
export type RequestStartPayload = BuiltRequest

export type RequestEndPayload = {
  ok: boolean
}

export type RequestErrorPayload = {
  error: unknown
}

export type RequestSuccessPayload<TRowItem = RowItem> = BuiltResponse<TRowItem>

export type SelectedKeysChangePayload<TRowItem = RowItem> = {
  keys: RowKey[]
  items: TRowItem[]
}

export type RowClickPayload<TRowItem = RowItem> = {
  key: RowKey
  item: TRowItem
}
