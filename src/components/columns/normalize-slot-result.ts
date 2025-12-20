import { Logger } from '@/logger'
import { SlotResult, TableColumnProps } from '../types'
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
    const tableColumnProps = node.componentOptions!.propsData as TableColumnProps
    let columnKey: ColumnKey

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
      tableColumnProps,
    }
  })
}
