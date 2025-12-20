import { ColumnKey, ColumnRegistry } from '../columns/types'
import { OrderDirection, RowItem, RowKey, RowKeySelector } from '../types'

export type TableData = {
  items: RowItem[]
  total: number
  filtered: number
}

export type SortState = {
  by: ColumnKey | null
  direction: OrderDirection | null
}

export type TableCoreConfig = {
  rowKey: RowKeySelector<RowItem>
  pagination: boolean
  rowsPerPageCount: number
  rowsPerPageOptions: number[]
  search: boolean
  orderBy: string | null
  orderDirection: OrderDirection | null
  selection: boolean
  selectionLimit: number | null
  allowSelectAll: boolean
}

export type TableCoreState = {
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

export type TableCoreApi = {
  /**
   * Stable getters
   */
  get state(): TableCoreState

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
  normalize(args: { columnRegistry: ColumnRegistry<RowItem>; props: TableCoreConfig }): void
}
