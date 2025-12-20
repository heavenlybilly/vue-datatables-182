import { ref, shallowRef } from 'vue'
import { Sticky } from '../types'
import { equalColumns } from './column-equality'
import { normalizeSlotResult } from './normalize-slot-result'
import type { ColumnDef, ColumnKey, ColumnRegistry, ColumnRegistryInput } from './types'
import { ColumnKind } from './types'

export const useColumnRegistry = <RowItem>() => {
  const columns = shallowRef<ColumnDef<RowItem>[]>([])
  const dataRevision = ref(0)
  let previous: ColumnDef<RowItem>[] = []
  let revision = 0

  const rebuild = ({ slots, tableProps }: ColumnRegistryInput) => {
    const normalized = normalizeSlotResult(slots.default?.())
    const leftSticky = normalized.some(
      ({ tableColumnProps }) => tableColumnProps.sticky === Sticky.LEFT,
    )
    const next: ColumnDef<RowItem>[] = []

    const internal = (kind: 'numbering' | 'selection', width: string) => {
      next.push({
        key: `_internal:${kind}` as ColumnKey,
        kind,
        width,
        sticky: leftSticky ? Sticky.LEFT : undefined,
      })
    }

    if (tableProps.numbering) {
      internal(ColumnKind.NUMBERING, '50px')
    }

    if (tableProps.selection) {
      internal(ColumnKind.SELECTION, '42px')
    }

    normalized.forEach(({ columnKey, tableColumnProps, className, cellSlot, headerSlot }) => {
      next.push({
        ...tableColumnProps,
        key: columnKey,
        kind: ColumnKind.DATA,
        className,
        slots: {
          cell: cellSlot,
          header: headerSlot,
        },
      })
    })

    const keys = new Set<string>()

    next.forEach(({ key }) => {
      if (keys.has(key)) {
        throw new Error(`Duplicate column key: ${key}`)
      }

      keys.add(key)
    })

    if (equalColumns(previous, next)) {
      return
    }

    if (!equalColumns(previous, next, true)) {
      revision += 1
      dataRevision.value = revision
    }

    previous = next
    columns.value = next
  }

  const registry: ColumnRegistry<RowItem> = {
    get columns() {
      return columns.value
    },
    get dataRevision() {
      return dataRevision.value
    },
    rebuild,
    findColumnByKey: (key, kind) =>
      columns.value.find((column) => column.key === key && (!kind || column.kind === kind)) ?? null,
  }

  return registry
}
