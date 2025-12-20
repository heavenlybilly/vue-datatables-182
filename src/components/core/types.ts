import { ColumnKey, ColumnRegistry } from '../columns/types'
import {
  DataTableProps,
  RowItem,
  RowKey,
  SelectionChangePayload,
  Sort,
  SortDirection,
  TableData,
} from '../types'

export type { TableData } from '../../types'

export type SortState = {
  by: ColumnKey | null
  direction: SortDirection | null
}

export type CoreOptions = {
  columnRegistry: ColumnRegistry<RowItem>
  props: DataTableProps
  emit: {
    (e: 'update:sort', sort: Sort): void
    (e: 'update:page', page: number): void
    (e: 'update:rowsPerPageCount', perPage: number): void
    (e: 'update:searchQuery', query: string): void
    (e: 'update:selectedRowKeys', keys: RowKey[]): void
    (e: 'selectionChange', payload: SelectionChangePayload): void
  }
}

export type CoreState = {
  tableData: TableData

  paginationEnabled: boolean
  rowsPerPageOptions: number[]
  rowsPerPageCount: number
  page: number

  searchEnabled: boolean
  searchQuery: string

  sort: SortState

  rowKeySelector: (item: RowItem) => RowKey
  selectionEnabled: boolean
  selectAllAllowed: boolean
  selectionLimit: number | null
  selectedRowKeys: RowKey[]

  isLoading: boolean
  error: unknown | null
}

export type Core = {
  get state(): CoreState

  get pageCount(): number

  setTableData(value: Partial<TableData>): void

  setPage(value: number): void
  correctPage(value: number): void
  setRowsPerPageCount(value: number): void

  setSearchQuery(value: string): void

  setSort(sortBy: ColumnKey | null, sortDirection: SortDirection | null): void
  clearSort(): void

  toggleRowItemSelection(rowItem: RowItem): void
  clearSelection(): void
  selectAllRows(): void

  setLoading(value: boolean): void
  setError(value: unknown | null): void

  normalize(deferData?: boolean): void
  reconcileSelection(): void
  reset(): void
  resetQuery(): void
}
