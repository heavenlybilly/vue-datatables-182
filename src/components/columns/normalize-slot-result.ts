import { Logger } from '@/logger'
import { TableColumnProps } from '../DataTableColumn.vue'
import { SlotResult } from '../types'
import { ColumnKey } from './types'

export const normalizeSlotResult = (slotResult: SlotResult) => {
  if (!slotResult) {
    return []
  }

  const nodes = Array.isArray(slotResult) ? slotResult : [slotResult]

  const filteredNodes = nodes.filter((node) => {
    return !!node && node?.tag?.includes('DataTableColumn') && !!node.componentOptions?.propsData
  })

  return filteredNodes.map((node, index) => {
    const staticClass = node.data?.staticClass
    const tableColumnProps = node.componentOptions!.propsData as TableColumnProps
    let columnKey: ColumnKey

    // @ts-ignore
    if (tableColumnProps?.searchable === '') {
      tableColumnProps.searchable = true
    }

    // @ts-ignore
    if (tableColumnProps?.sortable === '') {
      tableColumnProps.sortable = true
    }

    if (node.key !== null && node.key !== undefined) {
      columnKey = String(node.key) as ColumnKey
    } else if (tableColumnProps.field) {
      columnKey = `field:${tableColumnProps.field}` as ColumnKey
    } else {
      columnKey = `col:${index}` as ColumnKey
      Logger.warn(`Column key or prop field is not defined for column at index ${index}.`)
    }

    return {
      node,
      columnKey,
      staticClass,
      tableColumnProps,
    }
  })
}
