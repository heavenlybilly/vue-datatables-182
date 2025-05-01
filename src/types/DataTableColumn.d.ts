import type { VNode } from 'vue'
import { DTTextAlign } from '@/types/types'
import { DefineComponent } from '@/types/utils'

export interface DataTableColumnProps {
  field: string
  title: string
  orderable?: boolean
  searchable?: boolean
  width?: string
  textAlign?: DTTextAlign
}

export interface DataTableColumnSlots {
  cell(scope: { index: number; item: DTRowItem; number: number }): VNode
}

export declare const DataTableColumn: DefineComponent<DataTableColumnProps, DataTableColumnSlots>

export default DataTableColumn
