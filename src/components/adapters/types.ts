import { ColumnRegistry } from '../columns'
import { TableCoreApi } from '../core'

export type Adapter = ({
  columnRegistry,
  tableCore,
}: {
  columnRegistry: ColumnRegistry
  tableCore: TableCoreApi
}) => {
  apply: (...args: any) => void | Promise<void>
}
