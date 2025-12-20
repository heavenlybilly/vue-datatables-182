import { describe, expect, it } from 'vitest'
import type { RowItem, SortDirection } from '../src/types'
import { createLocalTable } from './helpers/local-table'

const sorted = (values: unknown[], direction: SortDirection = 'asc') => {
  const items = values.map((value, id) => ({ id, value }))
  const { core } = createLocalTable({ items, defaultSort: { by: 'value', direction } })
  return core.state.tableData.items.map((item) => item.id)
}

describe('local column values', () => {
  it.each([
    [[10, 2, 1], 'asc', [2, 1, 0]],
    [[10, 2, 1], 'desc', [0, 1, 2]],
    [['b', 'A', 'a'], 'asc', [1, 2, 0]],
    [['b', 'A', 'a'], 'desc', [0, 2, 1]],
    [[true, false, true], 'asc', [1, 0, 2]],
    [[true, false, true], 'desc', [0, 2, 1]],
    [[null, 2, undefined, 1, 2], 'asc', [3, 1, 4, 0, 2]],
    [[null, 2, undefined, 1, 2], 'desc', [1, 4, 3, 0, 2]],
    [[null, undefined, null], 'desc', [0, 1, 2]],
  ] as [unknown[], SortDirection, number[]][])(
    'sorts %j in %s order stably',
    (values, direction, ids) => {
      expect(sorted(values, direction)).toEqual(ids)
    },
  )

  it.each([[1, '2'], [false, 1], [{}, {}], [NaN], [Infinity], [-Infinity], [Symbol('x')]])(
    'rejects unsupported or heterogeneous values %j',
    (...values) => {
      expect(() => sorted(values)).toThrow(/Column value: local sort/)
    },
  )

  it('gives value priority over field for search and sort', () => {
    const items = [
      { id: 1, value: 'hidden', label: 'Banana' },
      { id: 2, value: 'wrong', label: 'Apple' },
    ]
    const { core } = createLocalTable(
      { items, defaultSearchQuery: 'a', defaultSort: { by: 'value', direction: 'asc' } },
      {
        field: 'value',
        value: (row) => (row as RowItem).label,
        searchable: true,
        sortable: true,
      },
    )
    expect(core.state.tableData.items.map((item) => item.id)).toEqual([2, 1])
    expect(core.state.tableData.filtered).toBe(2)
  })

  it('uses case-insensitive trimmed text without decoding entities or removing diacritics', () => {
    const items = [
      { id: 1, value: 'CAFÉ &amp;' },
      { id: 2, value: null },
    ]
    const { core, adapter } = createLocalTable({ items, defaultSearchQuery: ' café ' })
    expect(core.state.tableData.items.map((item) => item.id)).toEqual([1])
    core.setSearchQuery('cafe')
    adapter.apply()
    expect(core.state.tableData.filtered).toBe(0)
    core.setSearchQuery('&amp;')
    adapter.apply()
    expect(core.state.tableData.filtered).toBe(1)
  })

  it('does not filter when no columns are searchable and ignores the local filter prop', () => {
    const { core } = createLocalTable(
      { items: [{ id: 1, value: 'A' }], defaultSearchQuery: 'missing', filter: { remove: true } },
      {
        field: 'value',
        searchable: false,
      },
    )
    expect(core.state.tableData.filtered).toBe(1)
  })

  it('validates sort types even in rows excluded by search', () => {
    expect(() =>
      createLocalTable({
        items: [
          { id: 1, value: 'A' },
          { id: 2, value: 2 },
        ],
        defaultSearchQuery: 'A',
        defaultSort: { by: 'value', direction: 'asc' },
      }),
    ).toThrow('mixed value types')
  })
})
