import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import type { ColumnKey } from '../src/components/columns/types'
import { buildRequestContext } from '../src/components/data/build-request-context'
import type { TableFilter } from '../src/types'
import { createRemoteTable, mockFetch } from './helpers/remote-table'

describe('remote context', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('uses backend sortField for value-only columns and trims search', () => {
    const { options, core, columnRegistry, adapter } = createRemoteTable()
    columnRegistry.rebuild({
      tableProps: { rowKey: 'id' },
      slots: {
        default: () => [
          h(DataTableColumn, {
            key: 'score',
            value: () => 1,
            sortable: true,
            'sort-field': 'server_score',
          }),
        ],
      },
    })
    core.setSort('score' as ColumnKey, 'desc')
    core.setSearchQuery('  Alice  ')
    expect(buildRequestContext(options)).toEqual({
      url: '/users',
      pagination: true,
      requestBody: {
        page: 1,
        perPage: 25,
        search: 'Alice',
        sortBy: 'server_score',
        sortDirection: 'desc',
        filter: {},
      },
    })
    adapter.dispose()
  })

  it('omits pagination and blank search fields', () => {
    const { options, adapter } = createRemoteTable({}, { rowKey: 'id', pagination: false })
    expect(buildRequestContext(options)).toEqual({
      url: '/users',
      pagination: false,
      requestBody: { filter: {} },
    })
    adapter.dispose()
  })

  it.each([
    null,
    [],
    { nested: undefined },
    { value: NaN },
    { value: 1n },
    { value: () => 1 },
    { value: new Date() },
  ])('rejects invalid filters before sending a request: %s', async (filter) => {
    const fetch = mockFetch()
    const { adapter, emit } = createRemoteTable({ getFilter: () => filter as TableFilter })
    await adapter.reload()
    expect(fetch).not.toHaveBeenCalled()
    expect(emit.mock.calls.map(([event]) => event)).toEqual(['requestError', 'requestEnd'])
    adapter.dispose()
  })

  it('rejects cycles through arrays and allows shared JSON objects', async () => {
    const fetch = mockFetch()
    const values: unknown[] = []
    values.push(values)
    let filter: TableFilter = { values }
    const { adapter, core } = createRemoteTable({ getFilter: () => filter })
    await adapter.apply()
    expect(core.state.error).toBeInstanceOf(Error)
    expect(fetch).not.toHaveBeenCalled()
    const shared = { valid: true }
    filter = { a: shared, b: shared }
    await adapter.apply()
    expect(core.state.error).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(1)
    adapter.dispose()
  })

  it('does not confuse delimiter-containing keys or null with omitted values in deduplication', async () => {
    const fetch = mockFetch()
    let filter: TableFilter = { 'a:string(x)|b': 'y' }
    const { adapter } = createRemoteTable({ getFilter: () => filter })
    await adapter.apply()
    filter = { a: 'x', b: 'y' }
    await adapter.apply()
    filter = { a: null }
    await adapter.apply()
    filter = {}
    await adapter.apply()
    expect(fetch).toHaveBeenCalledTimes(4)
    adapter.dispose()
  })

  it('reports a missing URL without requestStart', async () => {
    const fetch = mockFetch()
    const { adapter, emit } = createRemoteTable({ getUrl: () => undefined })
    await adapter.apply()
    expect(fetch).not.toHaveBeenCalled()
    expect(emit.mock.calls.map(([event]) => event)).toEqual(['requestError', 'requestEnd'])
    adapter.dispose()
  })
})
