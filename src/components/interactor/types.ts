import { ComputedRef } from 'vue'
import { ColumnKey, ColumnRegistry } from '../columns/types'
import { Core } from '../core/types'
import { DataProvider } from '../data/types'
import { OrderDirection, RowClickPayload, RowItem, RowKey } from '../types'

export interface InteractorProps {
  getRowsClickable(): boolean
  getSelectOnRowClick(): boolean
  getSelectionEnabled(): boolean
  getAllowSelectAll(): boolean
}

export interface InteractorEmit {
  (e: 'rowClick', payload: RowClickPayload): void
}

export interface InteractorOptions {
  columnRegistry: ColumnRegistry<RowItem>
  core: Core
  data: DataProvider
  getRowKey(item: RowItem): RowKey
  props: InteractorProps
  emit: InteractorEmit
}

/**
 * Interactor
 */
export interface InteractorHandlers {
  searchInput(value: string): void
  sortClick(columnKey: ColumnKey): void
  pageChange(page: number): void
  rowsPerPageCountChange(rowsPerPage: number): void
  reload(): void | Promise<void>

  rowClick(item: RowItem): void
  toggleRowSelection(item: RowItem): void
  selectAllRows(): void
  clearRowSelection(): void
}

export interface InteractorUi {
  sortIndicators: ComputedRef<Record<ColumnKey, OrderDirection | null>>
  canSelectAll: ComputedRef<boolean>
}

export interface Interactor {
  handlers: InteractorHandlers
  ui: InteractorUi
}
