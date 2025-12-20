import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeRowKeySelector } from '../src/components/core/helpers'
import { useRemoteAdapter } from '../src/components/data/useRemoteAdapter'
import type { BuiltResponse, RowItem, RowKeySelector } from '../src/types'
import { createCore } from './helpers/create-core'
import { createLocalTable } from './helpers/local-table'

describe('row keys', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('rejects sparse datasets before filtering', () => {
    const items = Array<{ id: number }>(2)
    items[1] = { id: 1 }
    expect(() => createLocalTable({ items, defaultSearchQuery: 'hidden' })).toThrow(
      'items: row at index 0',
    )
  })

  it.each([null, undefined, NaN, Infinity, -Infinity, true, {}, 1n])('rejects key %s', (key) => {
    expect(() => createLocalTable({ items: [{ id: key }] })).toThrow('rowKey')
  })

  it('preserves empty strings, finite numbers and the distinction between numeric and string keys', () => {
    const { core } = createLocalTable({
      items: [{ id: '' }, { id: 1 }, { id: '1' }, { id: 1.5 }],
      selection: true,
    })
    core.selectAllRows()
    expect(core.state.selectedRowKeys).toEqual(['', 1, '1', 1.5])
  })

  it('rejects duplicate keys across the full dataset, including hidden pages and search results', () => {
    expect(() =>
      createLocalTable({
        items: [
          { id: 1, value: 'shown' },
          { id: 1, value: 'hidden' },
        ],
        defaultSearchQuery: 'shown',
        defaultRowsPerPageCount: 1,
      }),
    ).toThrow('rowKey: duplicate key')
  })

  it('validates custom selectors and rejects a missing selector', () => {
    const { core } = createLocalTable({
      items: [{ id: 1, code: 'A' }],
      rowKey: (item) => item.code,
      selection: true,
    })
    core.selectAllRows()
    expect(core.state.selectedRowKeys).toEqual(['A'])
    expect(() => makeRowKeySelector(undefined as unknown as RowKeySelector<RowItem>)).toThrow(
      'rowKey',
    )
    expect(() => createLocalTable({ items: [{ id: 1 }], rowKey: () => NaN })).toThrow('rowKey')
  })

  it('validates responses before changing the data and reports bad keys through requestError', async () => {
    const { core, columnRegistry, emit } = createCore()
    core.setTableData({ items: [{ id: 9 }], total: 1, filtered: 1 })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [{ id: 1 }, { id: 1 }], total: 2 }),
      }),
    )
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getCsrfToken: () => undefined,
      getRequestAdapter:
        () =>
        ({ url }) => ({ url }),
      getResponseAdapter: () => (data) => data as BuiltResponse,
    })
    await adapter.apply()
    expect(core.state.tableData.items).toEqual([{ id: 9 }])
    expect(core.state.error).toBeInstanceOf(Error)
    expect(emit).toHaveBeenCalledWith('requestError', { requestId: 1, error: core.state.error })
    expect(emit.mock.calls.some(([event]) => event === 'requestSuccess')).toBe(false)
    adapter.dispose()
  })
})
