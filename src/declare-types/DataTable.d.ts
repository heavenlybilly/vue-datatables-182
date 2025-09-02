import type { VNode } from 'vue'
import { DTMethod, DTOrderDirection, DTRowItem, DTSource, DTTableData } from '@/types'
import { DefineComponent, EmitFn } from './utils'

export interface DataTableProps {
  // data
  source?: DTSource
  url?: string | null
  items?: DTRowItem[]
  method?: DTMethod

  // pagination
  pagination?: boolean
  rowsPerPageCount?: number
  rowsPerPageOptions?: number[]

  // search
  searching?: boolean

  // order
  orderBy?: string | null
  orderDirection?: DTOrderDirection

  // row-selection
  rowSelection?: boolean

  // actions
  actions?: boolean

  // numbering
  numbering?: boolean

  // rows clickable
  rowsClickable?: boolean

  // appearance
  scrollX?: boolean
  fixedColumnsStart?: number
  fixedColumnsEnd?: number
  stickyHeader?: boolean
  verticalBorders?: boolean
}

export interface DataTableSlots {
  topLeftBeforeActions(): VNode[]

  topLeftAfterActions(): VNode[]

  topRight(): VNode[]

  actions(scope: { index: number; item: DTRowItem; number: number }): VNode
}

export interface DataTableEmitsOptions {
  /**
   * Emitted when the selected rows array changes.
   */
  'update:selected-rows'(value: DTRow<any>[]): void

  /**
   * Emitted when the row is clicked.
   */
  'row-click'(value: DTRow<any>): void

  /**
   * Emitted when data loading starts
   */
  'loading-start'(): void

  /**
   * Emitted when data loading end
   */
  'loading-end'(value: DTTableData<any>): void
}

export declare type DataTableEmits = EmitFn<DataTableEmitsOptions>

export interface DataTableMethods {
  /**
   * Reload table data.
   */
  reload(): Promise<void>
}

export declare const DataTable: DefineComponent<
  DataTableProps,
  DataTableSlots,
  DataTableEmits,
  DataTableMethods
>

export default DataTable
