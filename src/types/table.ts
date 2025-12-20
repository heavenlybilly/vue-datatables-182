import type { VNode } from 'vue'
import type { SortDirection, Source } from './constants'
import type { TableMessages } from './messages'
import type { RequestAdapter, ResponseAdapter, TableFilter } from './remote'
import type { RowItem, RowKey, RowKeySelector } from './rows'

export type Sort = {
  by: string
  direction: SortDirection
} | null

export type DataTableProps<T = RowItem> = {
  messages?: Partial<TableMessages>
  source?: Source
  url?: string
  filter?: TableFilter
  items?: readonly T[]
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter<T>
  pagination?: boolean
  page?: number
  defaultPage?: number
  rowsPerPageCount?: number
  defaultRowsPerPageCount?: number
  rowsPerPageOptions?: readonly number[]
  search?: boolean
  searchQuery?: string
  defaultSearchQuery?: string
  sort?: Sort
  defaultSort?: Sort
  rowKey: RowKeySelector<T>
  selection?: boolean
  allowSelectAll?: boolean
  selectedRowKeys?: readonly RowKey[]
  defaultSelectedRowKeys?: readonly RowKey[]
  selectionLimit?: number | null
  rowsClickable?: boolean
  selectOnRowClick?: boolean
  showPageDetails?: boolean
  scrollX?: boolean
  stickyHeader?: boolean
  verticalBorders?: boolean
  striped?: boolean
  numbering?: boolean
  density?: 'compact' | 'comfortable'
}

export type ToolbarSlotProps = {
  selectedCount: number
  loading: boolean
  clearSelection: () => void
  reload: () => Promise<void>
}

export type SearchSlotProps = {
  value: string
  setValue: (value: string) => void
}

export type PaginationSlotProps = {
  page: number
  pageCount: number
  setPage: (page: number) => void
}

export type RowsPerPageSlotProps = {
  value: number
  options: readonly number[]
  setValue: (value: number) => void
}

type ErrorSlotProps = {
  error: unknown
  retry: () => Promise<void>
}

export type DataTableSlots = {
  default?: () => VNode[]
  topLeftBeforeActions?: (props: ToolbarSlotProps) => VNode[]
  topLeftAfterActions?: (props: ToolbarSlotProps) => VNode[]
  topRight?: (props: ToolbarSlotProps) => VNode[]
  search?: (props: SearchSlotProps) => VNode[]
  pagination?: (props: PaginationSlotProps) => VNode[]
  rowsPerPage?: (props: RowsPerPageSlotProps) => VNode[]
  empty?: () => VNode[]
  noResults?: () => VNode[]
  loading?: () => VNode[]
  error?: (props: ErrorSlotProps) => VNode[]
}
