import { describe, expect, it } from 'vitest'
import type { RowKey } from '../src/types'
import { createLocalTable } from './helpers/local-table'

const items = [
  { id: 1, alternate: 'A' },
  { id: 2, alternate: 'B' },
  { id: 3, alternate: 'C' },
]

describe('selection reconciliation', () => {
  it('reduces limits in selection order and emits keys/items consistently', () => {
    const { core, props, emit } = createLocalTable({
      items,
      selection: true,
      defaultSelectedRowKeys: [3, 1, 2],
    })
    emit.mockClear()
    props.selectionLimit = 2
    core.normalize()
    expect(emit.mock.calls).toEqual([
      ['update:selectedRowKeys', [3, 1]],
      ['selectionChange', { keys: [3, 1], items: [items[2], items[0]] }],
    ])
    props.selectionLimit = null
    core.normalize()
    core.toggleRowItemSelection(items[1])
    expect(core.state.selectedRowKeys).toEqual([3, 1, 2])
  })

  it('removes absent and duplicate controlled keys once while preserving key order', () => {
    const { core, emit } = createLocalTable({
      items,
      selection: true,
      selectedRowKeys: [3, 3, 1, 9],
    })
    expect(core.state.selectedRowKeys).toEqual([3, 1])
    expect(emit.mock.calls.filter(([event]) => event === 'update:selectedRowKeys')).toEqual([
      ['update:selectedRowKeys', [3, 1]],
    ])
    emit.mockClear()
    core.normalize()
    core.normalize()
    expect(emit).not.toHaveBeenCalled()
  })

  it('ignores invalid selection keys without a repeated correction loop', () => {
    const keys = [NaN, null, 1] as unknown as RowKey[]
    const { core, emit } = createLocalTable({ items, selection: true, selectedRowKeys: keys })
    expect(core.state.selectedRowKeys).toEqual([1])
    emit.mockClear()
    core.normalize()
    core.normalize()
    expect(emit).not.toHaveBeenCalled()
  })

  it('reconciles deleted rows and does not emit selectionChange for changed contents at unchanged keys', () => {
    const { core, props, emit, adapter } = createLocalTable({
      items,
      selection: true,
      defaultSelectedRowKeys: [3, 1],
    })
    emit.mockClear()
    props.items = [{ id: 1, alternate: 'updated' }, items[1], items[2]]
    adapter.apply()
    expect(core.state.selectedRowKeys).toEqual([3, 1])
    expect(emit).not.toHaveBeenCalled()
    props.items = [items[0], items[1]]
    adapter.apply()
    expect(emit.mock.calls).toEqual([
      ['update:selectedRowKeys', [1]],
      ['selectionChange', { keys: [1], items: [items[0]] }],
    ])
  })

  it('clears selection when rowKey changes and rejects newly duplicate selector results', () => {
    const { core, props, emit, adapter } = createLocalTable({
      items,
      selection: true,
      defaultSelectedRowKeys: [1],
    })
    emit.mockClear()
    props.rowKey = 'alternate'
    core.normalize(true)
    adapter.apply()
    expect(core.state.selectedRowKeys).toEqual([])
    expect(emit.mock.calls).toEqual([
      ['update:selectedRowKeys', []],
      ['selectionChange', { keys: [], items: [] }],
    ])
    props.rowKey = () => 'duplicate'
    core.normalize(true)
    expect(() => adapter.apply()).toThrow('rowKey: duplicate')
  })

  it('blocks user selection during loading and rejects rows outside the visible page', () => {
    const { core } = createLocalTable({ items, selection: true, defaultRowsPerPageCount: 1 })
    core.toggleRowItemSelection(items[1])
    expect(core.state.selectedRowKeys).toEqual([])
    core.setLoading(true)
    core.toggleRowItemSelection(items[0])
    core.selectAllRows()
    expect(core.state.selectedRowKeys).toEqual([])
    core.setLoading(false)
    core.toggleRowItemSelection(items[0])
    expect(core.state.selectedRowKeys).toEqual([1])
  })

  it.each([-1, 0.5, NaN, Infinity])('rejects invalid selectionLimit %s', (selectionLimit) => {
    expect(() => createLocalTable({ items, selection: true, selectionLimit })).toThrow(
      'selectionLimit',
    )
  })
})
