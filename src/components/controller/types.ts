import { ComputedRef } from 'vue'
import { ColumnDef, ColumnKey, ColumnRegistry } from '../columns/types'
import { Core, CoreState } from '../core/types'
import { DataProvider } from '../data/types'
import { RowClickPayload, RowItem, SortDirection } from '../types'

export type ControllerProps = {
  isRowsClickable(): boolean
  isSelectOnRowClickEnabled(): boolean
  isShowPageDetailsEnabled(): boolean
  isScrollXEnabled(): boolean
  isStickyHeaderEnabled(): boolean
  isVerticalBordersEnabled(): boolean
  isStripedEnabled(): boolean
  isNumberingEnabled(): boolean
  isActionsEnabled(): boolean
}

export interface ControllerOptions {
  columnRegistry: ColumnRegistry<RowItem>
  core: Core
  dataProvider: DataProvider
  props: ControllerProps
  emit: {
    (e: 'rowClick', payload: RowClickPayload): void
  }
}

/**
 * Interactor
 */
export interface ControllerHandlers {
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

export interface ControllerUi {
  sortIndicators: ComputedRef<Record<ColumnKey, SortDirection | null>>
  canSelectAll: ComputedRef<boolean>
}

export interface Controller {
  columns: ReadonlyArray<ColumnDef<RowItem>>
  state: CoreState
  appearance: ControllerProps
  handlers: ControllerHandlers
  ui: ControllerUi
}
