import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRemoteTable, deferred, mockFetch, mockResponse } from './helpers/remote-table'

describe('remote responses', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('rejects a partial result when pagination is disabled', async () => {
    mockFetch({ items: [{ id: 1 }], total: 2 })
    const { adapter, core } = createRemoteTable({}, { rowKey: 'id', pagination: false })
    await adapter.apply()
    expect(core.state.error).toBeInstanceOf(Error)
    expect(core.state.tableData.items).toEqual([])
    adapter.dispose()
  })

  it.each([
    null,
    [],
    {},
    { items: {}, total: 1 },
    { items: [], total: -1 },
    { items: [], total: 1.5 },
    { items: [], total: Infinity },
    { items: [], total: Number.MAX_SAFE_INTEGER + 1 },
    { items: [], total: 1, filtered: 2 },
    { items: [], total: 1, filtered: null },
    { items: [{ id: 1 }, { id: 2 }], total: 1 },
    { items: Array.from({ length: 26 }, (_, id) => ({ id })), total: 100 },
  ])('rejects invalid response %j without replacing previous rows', async (data) => {
    mockFetch(data)
    const { adapter, core, emit } = createRemoteTable()
    core.setTableData({ items: [{ id: 9 }], total: 1, filtered: 1 })
    await adapter.reload()
    expect(core.state.tableData.items).toEqual([{ id: 9 }])
    expect(core.state.error).toBeInstanceOf(Error)
    expect(emit.mock.calls.map(([event]) => event)).toEqual([
      'requestStart',
      'requestError',
      'requestEnd',
    ])
    adapter.dispose()
  })

  it('makes only one corrective request and commits only the final response', async () => {
    const pending = deferred<Response>()
    const fetch = mockFetch()
    fetch
      .mockResolvedValueOnce(mockResponse({ items: [], total: 80, filtered: 30 }))
      .mockReturnValueOnce(pending.promise)
    const { adapter, core, emit } = createRemoteTable()
    core.setTableData({ items: [{ id: 9 }], total: 100, filtered: 100 })
    core.setPage(4)
    emit.mockClear()
    const work = adapter.reload()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    expect(core.state.page).toBe(2)
    expect(core.state.tableData.items).toEqual([{ id: 9 }])
    expect(core.state.isLoading).toBe(true)
    expect(JSON.parse(fetch.mock.calls[1][1].body).page).toBe(2)
    pending.resolve(mockResponse({ items: [{ id: 30 }], total: 80, filtered: 30 }))
    await work
    expect(core.state.tableData.items).toEqual([{ id: 30 }])
    expect(
      emit.mock.calls.filter(([event]) => event === 'requestEnd').map(([, payload]) => payload),
    ).toEqual([
      { requestId: 1, status: 'success' },
      { requestId: 2, status: 'success' },
    ])
    adapter.dispose()
  })

  it('reports repeated page shrinkage as an error without a third request', async () => {
    const fetch = mockFetch()
    fetch
      .mockResolvedValueOnce(mockResponse({ items: [], total: 30 }))
      .mockResolvedValueOnce(mockResponse({ items: [], total: 0 }))
    const { adapter, core, emit } = createRemoteTable()
    core.setTableData({ items: [{ id: 9 }], total: 100, filtered: 100 })
    core.setPage(4)
    await adapter.reload()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(core.state.tableData.items).toEqual([{ id: 9 }])
    expect(core.state.error).toBeInstanceOf(Error)
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 2, status: 'error' })
    adapter.dispose()
  })
})
