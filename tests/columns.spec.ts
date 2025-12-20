import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import { normalizeSlotResult } from '../src/components/columns/normalize-slot-result'
import { useColumnRegistry } from '../src/components/columns/useColumnRegistry'

describe('column normalization', () => {
  it('normalizes boolean attributes without mutating cached VNode props', () => {
    const node = h(DataTableColumn, { field: 'name' })
    node.props = { ...node.props, sortable: '', searchable: '' }
    Object.freeze(node.props)
    const [column] = normalizeSlotResult([node])
    expect(column.tableColumnProps).toMatchObject({ sortable: true, searchable: true })
    expect(node.props).toMatchObject({ sortable: '', searchable: '' })
  })

  it('rejects duplicate keys instead of silently replacing a column', () => {
    const registry = useColumnRegistry()
    expect(() =>
      registry.rebuild({
        tableProps: { rowKey: 'id' },
        slots: {
          default: () => [
            h(DataTableColumn, { field: 'name' }),
            h(DataTableColumn, { field: 'name' }),
          ],
        },
      }),
    ).toThrow('Duplicate column key')
  })
})
