import { ColumnKey, ColumnRegistry } from '../columns/types'
import {
  OrderDirection,
  RowItem,
  RowKey,
  RowKeySelector,
  SelectedKeysChangePayload,
} from '../types'

export type TableData = {
  items: RowItem[]
  total: number
  filtered: number
}

export type SortState = {
  by: ColumnKey | null
  direction: OrderDirection | null
}

export type CoreOptions = {
  columnRegistry: ColumnRegistry<RowItem>

  getRowKey: () => RowKeySelector<RowItem>
  getPagination: () => boolean
  getRowsPerPageCount: () => number
  getRowsPerPageOptions: () => number[]
  getSearch: () => boolean
  getOrderBy: () => string | null
  getOrderDirection: () => OrderDirection | null
  getSelection: () => boolean
  getSelectionLimit: () => number | null
  getAllowSelectAll: () => boolean

  emit: {
    (e: 'update:page', page: number): void
    (e: 'update:rowsPerPageCount', perPage: number): void
    (e: 'update:searchQuery', query: string): void
    (e: 'update:selectedRowKeys', keys: RowKey[]): void
    (e: 'selectionChange', payload: SelectedKeysChangePayload): void
  }
}

export type CoreState = {
  // data
  tableData: TableData

  // pagination
  page: number
  rowsPerPageCount: number
  rowsPerPageOptions: number[]
  paginationEnabled: boolean

  // search
  searchEnabled: boolean
  searchQuery: string

  // sort
  sort: SortState

  // row selection
  selectionEnabled: boolean
  selectedRowKeys: RowKey[]
  rowKeySelector: (item: RowItem) => RowKey
  selectionLimit: number | null
  allowSelectAll: boolean

  // status
  isLoading: boolean
  error: unknown | null
}

export type Core = {
  /**
   * Stable getters
   */
  get state(): CoreState

  /**
   * Computed getters
   */
  get pageCount(): number
  get rangeInfo(): { from: number; to: number; total: number }

  /**
   * Setters
   */
  // table data
  setTableData(value: Partial<TableData>): void

  // pagination
  setPage(value: number): void
  setRowsPerPageCount(value: number): void

  // search
  setSearchQuery(value: string): void

  // sort
  setSort(orderBy: ColumnKey | null, orderDirection: OrderDirection | null): void
  clearSort(): void

  // selection
  toggleRowItemSelection(rowItem: RowItem): void
  clearSelection(): void
  selectAllRows(): void

  // status
  setLoading(value: boolean): void
  setError(value: unknown | null): void

  // normalize
  normalize(): void
}
