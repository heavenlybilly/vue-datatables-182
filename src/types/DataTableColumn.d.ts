import type { VNode } from 'vue'
import { DefineComponent } from '@/types/core'
import { DTRow, DTTextAlign } from '@/types/types'

export interface DataTableColumnProps {
  title: string
  orderable?: boolean
  searchable?: boolean
  width?: string
  textAlign?: DTTextAlign
}

export interface DataTableColumnSlots {
  cell(scope: { row: DTRow }): VNode
}

export declare const DataTableColumn: DefineComponent<DataTableColumnProps, DataTableColumnSlots>

export default DataTableColumn
