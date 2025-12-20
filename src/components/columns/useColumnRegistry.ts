import { ref } from 'vue'
import { Slots, TableProps } from '../types'
import { normalizeSlotResult } from './normalize-slot-result'
import { ColumnDef, ColumnKey, ColumnKind, ColumnRegistry, MetaDef } from './types'

const numberingColumnKey = '_internal:numbering' as ColumnKey
const selectionColumnKey = '_internal:selection' as ColumnKey
const actionsColumnKey = '_internal:actions' as ColumnKey

export const useColumnRegistry = <RowItem>() => {
  const keysSnapshot = ref<ColumnKey[]>([])
  const columns = ref<ColumnDef<RowItem>[]>([])
  const meta = ref<MetaDef>({
    searchableKeys: [],
    orderableKeys: [],
  })

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
      ...(tableProps.actions ? [actionsColumnKey] : []),
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
    const columnKeys = new Set<string>()

    const newMeta: MetaDef = {
      searchableKeys: [],
      orderableKeys: [],
    }
    columns.value = []

    if (tableProps.numbering) {
      const fieldName = numberingColumnKey

      columns.value.push({
        key: fieldName,
        field: fieldName,
        kind: ColumnKind.NUMBERING,
      })

      columnKeys.add(numberingColumnKey)
    }

    if (tableProps.selection) {
      const fieldName = selectionColumnKey

      columns.value.push({
        key: fieldName,
        field: fieldName,
        kind: ColumnKind.SELECTION,
      })

      columnKeys.add(selectionColumnKey)
    }

    if (tableProps.actions) {
      columnKeys.add(actionsColumnKey)
    }

    normalizedItems.forEach((item) => {
      const { node, columnKey, tableColumnProps } = item

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
        orderable: tableColumnProps.orderable,
        width: tableColumnProps.width,
        textAlign: tableColumnProps.textAlign,
        sticky: tableColumnProps.sticky,
        slots: {
          cell: cellSlot ? (ctx) => cellSlot(ctx) : undefined,
        },
      }

      columns.value.push(newColumn)

      if (tableColumnProps.searchable) {
        newMeta.searchableKeys.push(columnKey)
      }

      if (tableColumnProps.orderable) {
        newMeta.orderableKeys.push(columnKey)
      }
    })

    if (tableProps.actions) {
      const fieldName = actionsColumnKey

      columns.value.push({
        key: fieldName,
        field: fieldName,
        kind: ColumnKind.ACTIONS,
      })
    }

    meta.value = newMeta
  }

  const registry: ColumnRegistry<RowItem> = {
    get columns() {
      return columns.value
    },
    get meta() {
      return meta.value
    },
    rebuild,
  }

  return registry
}
