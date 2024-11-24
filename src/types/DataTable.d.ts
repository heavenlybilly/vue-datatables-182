import type { VNode } from 'vue'
import { DefineComponent, EmitFn } from '@/types/core'
import { DTOrderDirection, DTRow, DTRowItem, DTSource } from '@/types/types'

export interface DataTableProps {
  // data
  source?: DTSource
  url?: string | null
  items?: DTRowItem[]

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

  // scrollX
  scrollX?: boolean

  // fixed columns
  fixedColumnsStart?: number
  fixedColumnsEnd?: number

  // rows clickable
  rowsClickable?: boolean
}

export interface DataTableSlots {
  topLeftBeforeActions(): VNode[]

  topLeftAfterActions(): VNode[]

  topRight(): VNode[]

  actions(scope: { row: DTRow }): VNode
}

export interface DataTableEmitsOptions {
  /**
   * Emitted when the selected rows array changes.
   * @param {DTRow[]} value - Selected rows.
   */
  'update:selected-rows'(value: DTRow[]): void

  /**
   * Emitted when the row is clicked.
   * @param {DTRow} value - Clicked row.
   */
  'row-click'(value: DTRow): void
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
