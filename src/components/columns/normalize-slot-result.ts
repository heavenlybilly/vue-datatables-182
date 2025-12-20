import { Fragment, isVNode } from 'vue'
import type { VNode } from 'vue'
import DataTableColumn from '../DataTableColumn.vue'
import type { SlotResult } from '../types'
import { normalizeColumnProps } from './normalize-column-props'
import { stickyWidth } from './sticky-width'
import type { ColumnCellSlot, ColumnDef, ColumnKey } from './types'

const isColumnNode = (node: VNode): boolean =>
  node.type === (DataTableColumn as unknown) ||
  (
    node.type as {
      name?: string
    }
  )?.name === 'DataTableColumn'

const flatten = (input: unknown): VNode[] => {
  if (Array.isArray(input)) {
    return input.flatMap(flatten)
  }

  if (!isVNode(input)) {
    return []
  }

  return input.type === Fragment ? flatten(input.children) : [input]
}

export const normalizeSlotResult = (slotResult: SlotResult) =>
  flatten(slotResult)
    .filter(isColumnNode)
    .map((node) => {
      const { props: tableColumnProps, className } = normalizeColumnProps(node.props ?? {})
      const slots =
        node.children !== null && typeof node.children === 'object' && !Array.isArray(node.children)
          ? (node.children as Record<string, unknown>)
          : {}
      const { cell } = slots
      const { header } = slots

      if (cell !== undefined && typeof cell !== 'function') {
        throw new Error('Column cell-slot must be a function')
      }

      if (header !== undefined && typeof header !== 'function') {
        throw new Error('Column header-slot must be a function')
      }

      if (tableColumnProps.field === undefined && !tableColumnProps.value && !cell) {
        throw new Error('Column must define field, value or cell-slot')
      }

      const key =
        node.key ??
        (tableColumnProps.field !== undefined ? `field:${tableColumnProps.field}` : undefined)

      if (typeof key !== 'string' || !key.trim()) {
        throw new Error(
          'Column key must be a non-empty string; value-only and slot-only columns require an explicit key',
        )
      }

      if (key.startsWith('_internal:')) {
        throw new Error('Column key prefix _internal: is reserved')
      }

      if (tableColumnProps.sticky) {
        stickyWidth(tableColumnProps.width, key)
      }

      return {
        columnKey: key as ColumnKey,
        className,
        tableColumnProps,
        cellSlot: cell as ColumnCellSlot<unknown> | undefined,
        headerSlot: header as NonNullable<ColumnDef<unknown>['slots']>['header'],
      }
    })
