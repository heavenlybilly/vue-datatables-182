import DataTable from './components/DataTable.vue'
import DataTableColumn from './components/DataTableColumn.vue'
import type {
  DataTableColumnSlots,
  DataTableEmits,
  DataTableProps,
  RequestSuccessPayload,
  RowClickPayload,
  SelectionChangePayload,
} from './types'

type TableInstance = InstanceType<typeof DataTable>

type ColumnInstance = InstanceType<typeof DataTableColumn>

type RowProps = 'items' | 'rowKey' | 'responseAdapter'

type RowListeners = 'onRowClick' | 'onSelectionChange' | 'onRequestSuccess'

export type TypedDataTable<T extends object> = Omit<typeof DataTable, never> & {
  new (): Omit<TableInstance, '$props' | '$emit'> & {
    $props: Omit<TableInstance['$props'], RowProps | RowListeners> &
      Pick<DataTableProps<T>, RowProps> & {
        onRowClick?: (payload: RowClickPayload<T>) => void
        onSelectionChange?: (payload: SelectionChangePayload<T>) => void
        onRequestSuccess?: (payload: RequestSuccessPayload<T>) => void
      }
    $emit: DataTableEmits<T>
  }
}

export type TypedDataTableColumn<T extends object> = Omit<typeof DataTableColumn, never> & {
  new (): Omit<ColumnInstance, '$props' | '$slots'> & {
    $props: Omit<ColumnInstance['$props'], 'field' | 'value'> & {
      field?: Extract<keyof T, string>
      value?: (item: T) => unknown
    }
    $slots: DataTableColumnSlots<T>
  }
}

export type TypedTable<T extends object> = {
  DataTable: TypedDataTable<T>
  DataTableColumn: TypedDataTableColumn<T>
}

export function createTypedTable<T extends object>(): TypedTable<T> {
  return {
    DataTable,
    DataTableColumn,
  } as unknown as TypedTable<T>
}
