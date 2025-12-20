import type { VNode } from 'vue'
import type {
  CellSlotProps,
  DataTableProps,
  HeaderSlotProps,
  RowItem as TableRowItem,
} from '../../types'
import type { Branded, Slots, Sticky, TextAlign, ValueOf } from '../types'

export type ColumnKey = Branded<string, 'columnKey'>

export const ColumnKind = {
  DATA: 'data',
  SELECTION: 'selection',
  NUMBERING: 'numbering',
} as const

export type ColumnKind = ValueOf<typeof ColumnKind>

export type ColumnCellSlot<T> = (ctx: CellSlotProps<T>) => VNode[]

export interface ColumnDef<T> {
  key: ColumnKey
  kind?: ColumnKind
  title?: string
  field?: string
  value?: (item: T) => unknown
  searchable?: boolean
  sortable?: boolean
  sortField?: string
  width?: string
  textAlign?: TextAlign
  sticky?: Sticky
  className?: string
  textOverflow?: 'wrap' | 'ellipsis'
  headerTextOverflow?: 'wrap' | 'ellipsis'
  slots?: {
    cell?: ColumnCellSlot<T>
    header?: (props: HeaderSlotProps) => VNode[]
  }
}

export type ColumnRegistryInput = {
  slots: Slots
  tableProps: DataTableProps
}

export type ColumnRegistry<T = TableRowItem> = {
  readonly dataRevision: number
  readonly columns: readonly ColumnDef<T>[]
  rebuild(args: ColumnRegistryInput): void
  findColumnByKey(key: ColumnKey, kind?: ColumnKind): ColumnDef<T> | null
}
