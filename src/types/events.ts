import type { BuiltRequest } from './remote'
import type { RowItem, RowKey, TableData } from './rows'
import type { Sort } from './table'

export type RequestStartPayload = {
  requestId: number
  request: BuiltRequest
}

export type RequestEndPayload = {
  requestId: number
  status: 'success' | 'error' | 'aborted'
}

export type RequestErrorPayload = {
  requestId: number
  error: unknown
}

export type RequestSuccessPayload<T = RowItem> = {
  requestId: number
  data: TableData<T>
}

export type SelectionChangePayload<T = RowItem> = {
  keys: RowKey[]
  items: T[]
}

export type RowClickPayload<T = RowItem> = {
  key: RowKey
  item: T
}

export type DataTableEmits<T = RowItem> = {
  (e: 'update:sort', sort: Sort): void
  (e: 'update:page', page: number): void
  (e: 'update:rowsPerPageCount', perPage: number): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:selectedRowKeys', keys: RowKey[]): void
  (e: 'selectionChange', payload: SelectionChangePayload<T>): void
  (e: 'requestStart', payload: RequestStartPayload): void
  (e: 'requestEnd', payload: RequestEndPayload): void
  (e: 'requestError', payload: RequestErrorPayload): void
  (e: 'requestSuccess', payload: RequestSuccessPayload<T>): void
  (e: 'rowClick', payload: RowClickPayload<T>): void
}
