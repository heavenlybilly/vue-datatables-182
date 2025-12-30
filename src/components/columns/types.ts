import { TableProps } from '../DataTable.vue'
import { Branded, RowKey, Slots, Sticky, TextAlign, ValueOf } from '../types'

export type ColumnKey = Branded<string, 'columnKey'>

export const ColumnKind = {
  DATA: 'data',
  SELECTION: 'selection',
  NUMBERING: 'numbering',
} as const
export type ColumnKind = ValueOf<typeof ColumnKind>

export type ColumnCellSlot<RowItem> = (ctx: { item: RowItem }) => any

export interface ColumnDef<RowItem> {
  /**
   * Unique column identifier.
   */
  key: ColumnKey

  /**
   * Column type (e.g., data, numbering, selection, action).
   */
  kind?: ColumnKind

  /**
   * Column header text.
   */
  title?: string

  /**
   * Name of the field in a row object whose value will be displayed.
   * Used for simple value access (row[field]).
   */
  field?: (keyof RowItem & string) | string

  /**
   * Custom value extractor.
   * Has priority over `field` when both are defined.
   */
  value?: (item: RowItem) => unknown

  /**
   * Enables text search for this column.
   * When enabled, column values are included in search matching.
   */
  searchable?: boolean

  /**
   * Allows this column to participate in sorting logic.
   * Can be used to disable sorting while keeping sorting UI.
   */
  sortable?: boolean

  /**
   * CSS width of the column (e.g. '120px', '20%', 'auto').
   */
  width?: string

  /**
   * Text alignment for cell content.
   */
  textAlign?: TextAlign

  /**
   * Makes column sticky (left / right).
   */
  sticky?: Sticky

  /**
   * CSS class name for the column.
   */
  className?: string

  /**
   * Slot renderers for column content.
   */
  slots?: {
    /**
     * Renders a single cell.
     */
    cell?: ColumnCellSlot<RowItem>
  }
}

export type ColumnRegistry<RowItem = any> = {
  readonly columns: Readonly<ColumnDef<RowItem>[]>
  rebuild(args: { slots: Slots; tableProps: TableProps }): void
  findColumnByKey(key: ColumnKey, kind?: ColumnKind): ColumnDef<RowItem> | null
  findColumnByField(field: string, kind?: ColumnKind): ColumnDef<RowItem> | null
}
