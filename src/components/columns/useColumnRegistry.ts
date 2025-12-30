import { ref } from 'vue'
import { TableProps } from '../DataTable.vue'
import { Slots, Sticky } from '../types'
import { normalizeSlotResult } from './normalize-slot-result'
import { ColumnDef, ColumnKey, ColumnKind, ColumnRegistry } from './types'

const numberingColumnKey = '_internal:numbering' as ColumnKey
const selectionColumnKey = '_internal:selection' as ColumnKey

export const useColumnRegistry = <RowItem>() => {
  const keysSnapshot = ref<ColumnKey[]>([])
  const columns = ref<ColumnDef<RowItem>[]>([])

  const rebuild = ({ slots, tableProps }: { slots: Slots; tableProps: TableProps }) => {
    /**
     * Normalize slot's result, extract nodes with props and keys
     */
    const normalizedItems = normalizeSlotResult(slots.default?.())

    /**
     * Check if columns have changed.
     */
    const newSnapshot: ColumnKey[] = [
      ...(tableProps.numbering ? [numberingColumnKey] : []),
      ...(tableProps.selection ? [selectionColumnKey] : []),
      ...normalizedItems.map((x) => x.columnKey),
    ]

    const isChanged =
      newSnapshot.length !== keysSnapshot.value.length ||
      !keysSnapshot.value.every((key, index) => key === newSnapshot[index])

    if (!isChanged) {
      return
    }

    keysSnapshot.value = newSnapshot

    /**
     * Rebuild columns and meta.
     */
    const leftStickyColumnsExist = columns.value.filter((column) => column.sticky === Sticky.LEFT)

    const columnKeys = new Set<string>()

    columns.value = []

    if (tableProps.numbering) {
      const fieldName = numberingColumnKey

      columns.value.push({
        key: fieldName,
        field: fieldName,
        kind: ColumnKind.NUMBERING,
        width: '50px',
        sticky: leftStickyColumnsExist ? Sticky.LEFT : undefined,
      })

      columnKeys.add(numberingColumnKey)
    }

    if (tableProps.selection) {
      const fieldName = selectionColumnKey

      columns.value.push({
        key: fieldName,
        field: fieldName,
        kind: ColumnKind.SELECTION,
        width: '42px',
        sticky: leftStickyColumnsExist ? Sticky.LEFT : undefined,
      })

      columnKeys.add(selectionColumnKey)
    }

    normalizedItems.forEach((item) => {
      const { node, columnKey, tableColumnProps, staticClass } = item

      /**
       * todo: potential failure point
       */
      const cellSlot = node.componentInstance?.$scopedSlots?.cell

      if (columnKeys.has(columnKey)) {
        throw new Error(`Duplicate column key: ${String(columnKey)}`)
      }
      columnKeys.add(columnKey)

      const newColumn: ColumnDef<RowItem> = {
        key: columnKey,
        kind: ColumnKind.DATA,
        title: tableColumnProps.title,
        field: tableColumnProps.field,
        value: tableColumnProps.value,
        searchable: tableColumnProps.searchable,
        sortable: tableColumnProps.sortable,
        width: tableColumnProps.width,
        textAlign: tableColumnProps.textAlign,
        sticky: tableColumnProps.sticky,
        className: staticClass,
        slots: {
          cell: cellSlot ? (ctx) => cellSlot(ctx) : undefined,
        },
      }

      columns.value.push(newColumn)
    })
  }

  const findColumnByKey = (key: ColumnKey, kind?: ColumnKind) => {
    return (
      columns.value.find((column) => {
        return column.key === key && (!kind || column.kind === kind)
      }) ?? null
    )
  }

  const findColumnByField = (field: string, kind?: ColumnKind) => {
    return (
      columns.value.find((column) => {
        return column.field === field && (!kind || column.kind === kind)
      }) ?? null
    )
  }

  const registry: ColumnRegistry<RowItem> = {
    get columns() {
      return columns.value
    },
    rebuild,
    findColumnByKey,
    findColumnByField,
  }

  return registry
}
