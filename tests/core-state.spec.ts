import { describe, expect, it, vi } from 'vitest'
import { h, reactive } from 'vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import type { ColumnKey } from '../src/components/columns/types'
import { useColumnRegistry } from '../src/components/columns/useColumnRegistry'
import { useCore } from '../src/components/core/useCore'
import type { DataTableProps } from '../src/types'
import { SortDirection } from '../src/types'

const setup = (values: Partial<DataTableProps> = {}) => {
  const props = reactive<DataTableProps>({ rowKey: 'id', selection: true, ...values })
  const emit = vi.fn()
  const columnRegistry = useColumnRegistry()
  columnRegistry.rebuild({
    tableProps: props,
    slots: { default: () => [h(DataTableColumn, { key: 'name', field: 'name', sortable: true })] },
  })
  const core = useCore({ props, emit, columnRegistry })
  core.normalize()
  core.setTableData({ items: [{ id: 1 }, { id: 2 }], total: 100, filtered: 100 })
  emit.mockClear()
  return { props, core, emit }
}

describe('state ownership', () => {
  it('treats controlled null sort as authoritative over defaultSort', () => {
    const { core } = setup({ sort: null, defaultSort: { by: 'name', direction: 'asc' } })
    expect(core.state.sort.by).toBeNull()
  })

  it('preserves autonomous state and ignores later defaults or a new controlled prop', () => {
    const { core, props } = setup({ defaultRowsPerPageCount: 10 })
    core.setRowsPerPageCount(50)
    core.setSearchQuery(' Anna ')
    core.setSort('name' as ColumnKey, SortDirection.DESC)
    props.defaultRowsPerPageCount = 5
    props.rowsPerPageCount = 5
    core.normalize()
    expect(core.state).toMatchObject({ rowsPerPageCount: 50, searchQuery: ' Anna ' })
    expect(core.state.sort).toEqual({ by: 'name', direction: 'desc' })
  })

  it('proposes controlled values without applying them until parent confirmation', () => {
    const { core, props, emit } = setup({
      page: 2,
      rowsPerPageCount: 10,
      searchQuery: '',
      sort: null,
    })
    core.setPage(3)
    core.setRowsPerPageCount(50)
    core.setSearchQuery('Anna')
    core.setSort('name' as ColumnKey, SortDirection.ASC)
    expect(core.state).toMatchObject({ page: 2, rowsPerPageCount: 10, searchQuery: '' })
    expect(core.state.sort.by).toBeNull()
    expect(emit.mock.calls.map(([event]) => event)).toEqual([
      'update:page',
      'update:rowsPerPageCount',
      'update:searchQuery',
      'update:sort',
    ])
    props.searchQuery = 'Anna'
    core.normalize()
    expect(core.state).toMatchObject({ searchQuery: 'Anna', page: 1 })
    expect(emit.mock.calls.filter(([event]) => event === 'update:searchQuery')).toHaveLength(1)
  })

  it('copies frozen options and removes invalid options', () => {
    const options = Object.freeze([10, 10, -1, NaN, 25.9])
    const { core } = setup({ rowsPerPageOptions: options, defaultRowsPerPageCount: 50 })
    expect(core.state.rowsPerPageOptions).toEqual([10, 25, 50])
    expect(options).toHaveLength(5)
  })

  it('clears selection when disabled and does not restore it when enabled again', () => {
    const { core, props, emit } = setup()
    core.toggleRowItemSelection(core.state.tableData.items[0])
    emit.mockClear()
    props.selection = false
    core.normalize()
    props.selection = true
    core.normalize()
    expect(core.state.selectedRowKeys).toEqual([])
    expect(emit.mock.calls).toEqual([
      ['update:selectedRowKeys', []],
      ['selectionChange', { keys: [], items: [] }],
    ])
  })

  it('keeps controlled selection pending and emits selectionChange only on confirmation', () => {
    const { core, props, emit } = setup({ selectedRowKeys: [] })
    core.toggleRowItemSelection(core.state.tableData.items[0])
    expect(core.state.selectedRowKeys).toEqual([])
    expect(emit.mock.calls).toEqual([['update:selectedRowKeys', [1]]])
    props.selectedRowKeys = [1]
    core.normalize()
    expect(core.state.selectedRowKeys).toEqual([1])
    expect(emit).toHaveBeenLastCalledWith('selectionChange', { keys: [1], items: [{ id: 1 }] })
  })

  it('clears dependent selection even when pagination is disabled', () => {
    const { core, emit } = setup({ pagination: false })
    core.selectAllRows()
    emit.mockClear()
    core.setSearchQuery('x')
    expect(emit.mock.calls.map(([event]) => event)).toEqual([
      'update:searchQuery',
      'update:selectedRowKeys',
      'selectionChange',
    ])
  })

  it('proposes each invalid controlled input correction once', () => {
    const { core, props, emit } = setup({ page: -2, rowsPerPageCount: NaN })
    core.normalize()
    core.normalize()
    expect(emit).not.toHaveBeenCalled()
    props.page = -3
    core.normalize()
    core.normalize()
    expect(emit.mock.calls).toEqual([['update:page', 1]])
  })

  it('normalizes controlled keys by value and respects zero selection limit', () => {
    const keys = reactive([2, 1])
    const { core, props, emit } = setup({ selectedRowKeys: keys })
    keys.reverse()
    core.normalize()
    expect(core.state.selectedRowKeys).toEqual([1, 2])
    emit.mockClear()
    props.selectionLimit = 0
    core.normalize()
    core.selectAllRows()
    expect(core.state.selectedRowKeys).toEqual([])
    expect(emit.mock.calls.filter(([event]) => event === 'update:selectedRowKeys')).toEqual([
      ['update:selectedRowKeys', []],
    ])
  })
})
