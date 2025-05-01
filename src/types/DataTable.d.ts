import type { VNode } from 'vue'
import { DTMethod, DTOrderDirection, DTRowItem, DTSource, DTTableData } from '@/types/types'
import { DefineComponent, EmitFn } from '@/types/utils'

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

  actions(scope: { index: number; item: DTRowItem; number: number }): VNode
}

export interface DataTableEmitsOptions {
  /**
   * Emitted when the selected rows array changes.
   */
  'update:selected-rows'(
    value: {
      index: number
      number: number
      item: Record<string, string | number | boolean | null>
    }[],
  ): void

  /**
   * Emitted when the row is clicked.
   */
  'row-click'(value: {
    index: number
    number: number
    item: Record<string, string | number | boolean | null>
  }): void

  /**
   * Emitted when data loading starts
   */
  'loading-start'(): void

  /**
   * Emitted when data loading end
   * todo: fix any
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
