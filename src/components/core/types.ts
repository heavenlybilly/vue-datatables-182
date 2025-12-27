import { ColumnKey, ColumnRegistry } from '../columns/types'
import { RowItem, RowKey, RowKeySelector, SelectedKeysChangePayload, SortDirection } from '../types'

export type TableData = {
  items: RowItem[]
  total: number
  filtered: number
}

export type SortState = {
  by: ColumnKey | null
  direction: SortDirection | null
}

export type CoreOptions = {
  columnRegistry: ColumnRegistry<RowItem>
  props: {
    // pagination
    isPaginationEnabled(): boolean
    getRowsPerPageCount(): number
    getRowsPerPageOptions(): number[]

    // search
    isSearchEnabled(): boolean

    // sort
    getSortBy(): string | null
    getSortDirection(): SortDirection | null

    // row selection
    getRowKey(): RowKeySelector<RowItem>
    isSelectionEnabled(): boolean
    isSelectAllAllowed(): boolean
    getSelectionLimit(): number | null
  }
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
  paginationEnabled: boolean
  rowsPerPageOptions: number[]
  rowsPerPageCount: number
  page: number

  // search
  searchEnabled: boolean
  searchQuery: string

  // sort
  sort: SortState

  // rows & selection & click
  rowKeySelector: (item: RowItem) => RowKey
  selectionEnabled: boolean
  selectAllAllowed: boolean
  selectionLimit: number | null
  selectedRowKeys: RowKey[]

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
  setSort(sortBy: ColumnKey | null, sortDirection: SortDirection | null): void
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
