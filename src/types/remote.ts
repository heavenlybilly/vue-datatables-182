import type { SortDirection } from './constants'
import type { RowItem } from './rows'

export type TableFilter = Record<string, unknown>

export type RequestContext = {
  url: string
  pagination: boolean
  requestBody: {
    page?: number
    perPage?: number
    search?: string
    sortBy?: string
    sortDirection?: SortDirection
    filter?: TableFilter
    [key: string]: unknown
  }
}

export type BuiltRequest = {
  url: string
  method?: 'GET' | 'POST'
  credentials?: 'omit' | 'same-origin' | 'include'
  headers?: Record<string, string>
  requestBody?: unknown
}

export type RequestAdapter = (context: RequestContext) => BuiltRequest

export type BuiltResponse<T = RowItem> = {
  items: T[]
  total: number
  filtered?: number
}

export type ResponseAdapter<T = RowItem> = (response: unknown) => BuiltResponse<T>
