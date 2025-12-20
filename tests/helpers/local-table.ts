import { vi } from 'vitest'
import { h, reactive } from 'vue'
import DataTableColumn from '../../src/components/DataTableColumn.vue'
import { useColumnRegistry } from '../../src/components/columns/useColumnRegistry'
import { useCore } from '../../src/components/core/useCore'
import { useLocalAdapter } from '../../src/components/data/useLocalAdapter'
import type { DataTableColumnProps, DataTableProps } from '../../src/types'
import { Source } from '../../src/types'

export const createLocalTable = (
  values: Partial<DataTableProps> = {},
  column: DataTableColumnProps = { field: 'value', searchable: true, sortable: true },
) => {
  const props = reactive<DataTableProps>({ rowKey: 'id', source: Source.LOCAL, ...values })
  const emit = vi.fn()
  const columnRegistry = useColumnRegistry()
  columnRegistry.rebuild({
    tableProps: props,
    slots: { default: () => [h(DataTableColumn, { key: 'value', ...column })] },
  })
  const core = useCore({ props, emit, columnRegistry })
  const adapter = useLocalAdapter({ core, columnRegistry, getLocalItems: () => props.items ?? [] })
  core.normalize(true)
  adapter.apply()
  return { core, props, emit, adapter, columnRegistry }
}
