import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RequestAdapter, ResponseAdapter } from '../src/types'
import { createRemoteTable, deferred, mockFetch, mockResponse } from './helpers/remote-table'

describe('remote attempts', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('cancels a different pending context when returning to the displayed successful context', async () => {
    const pending = deferred<Response>()
    const fetch = mockFetch()
    fetch
      .mockResolvedValueOnce(mockResponse({ items: [{ id: 1 }], total: 1 }))
      .mockReturnValueOnce(pending.promise)
    const { adapter, core, emit } = createRemoteTable()
    await adapter.apply()
    core.setSearchQuery('new')
    const work = adapter.apply()
    core.setSearchQuery('')
    await adapter.apply()
    await work
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(core.state.isLoading).toBe(false)
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 2, status: 'aborted' })
    pending.resolve(mockResponse({ items: [{ id: 2 }], total: 1 }))
    await flushPromises()
    expect(core.state.tableData.items).toEqual([{ id: 1 }])
    adapter.dispose()
  })

  it('settles cancellation from requestAdapter before fetch without success or error', async () => {
    const fetch = mockFetch()
    let cancel!: () => void
    const requestAdapter: RequestAdapter = ({ url }) => {
      cancel()
      return { url }
    }
    const { adapter, emit } = createRemoteTable({ getRequestAdapter: () => requestAdapter })
    cancel = adapter.cancel
    await adapter.reload()
    expect(fetch).not.toHaveBeenCalled()
    expect(emit.mock.calls).toEqual([['requestEnd', { requestId: 1, status: 'aborted' }]])
    adapter.dispose()
  })

  it('finishes replaced attempts as aborted and ignores late JSON', async () => {
    const parsing = deferred<unknown>()
    const next = deferred<Response>()
    const fetch = mockFetch()
    fetch
      .mockResolvedValueOnce({ ok: true, json: () => parsing.promise })
      .mockReturnValueOnce(next.promise)
    const { adapter, core, emit } = createRemoteTable()
    const first = adapter.apply()
    await flushPromises()
    const second = adapter.reload()
    await first
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'aborted' })
    expect(core.state.isLoading).toBe(true)
    parsing.resolve({ items: [{ id: 9 }], total: 1 })
    await flushPromises()
    expect(core.state.tableData.items).toEqual([])
    next.resolve(mockResponse({ items: [{ id: 2 }], total: 1 }))
    await second
    expect(core.state.tableData.items).toEqual([{ id: 2 }])
    expect(emit.mock.calls.map(([event, payload]) => [event, payload.requestId])).toEqual([
      ['requestStart', 1],
      ['requestEnd', 1],
      ['requestStart', 2],
      ['requestSuccess', 2],
      ['requestEnd', 2],
    ])
    adapter.dispose()
  })

  it('invalidates active and completed snapshots when adapters change', async () => {
    const pending = deferred<Response>()
    const fetch = mockFetch()
    fetch.mockReturnValueOnce(pending.promise)
    let requestAdapter: RequestAdapter | undefined
    let responseAdapter: ResponseAdapter | undefined
    const { adapter, core, emit } = createRemoteTable({
      getRequestAdapter: () => requestAdapter,
      getResponseAdapter: () => responseAdapter,
    })
    const first = adapter.apply()
    requestAdapter = ({ url }) => ({ url: `${url}?custom`, method: 'GET' })
    await adapter.apply()
    await first
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'aborted' })
    responseAdapter = () => ({ items: [{ id: 3 }], total: 1 })
    await adapter.apply()
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(core.state.tableData.items).toEqual([{ id: 3 }])
    pending.resolve(mockResponse({ items: [{ id: 9 }], total: 1 }))
    await flushPromises()
    expect(core.state.tableData.items).toEqual([{ id: 3 }])
    adapter.dispose()
  })

  it.each(['http', 'json', 'responseAdapter'])(
    'reports %s failures and permits retry with increasing ids',
    async (kind) => {
      const fetch = mockFetch()
      if (kind === 'http') fetch.mockResolvedValueOnce({ ok: false, status: 503 })
      if (kind === 'json')
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new Error('bad JSON')
          },
        })
      let fail = true
      const responseAdapter: ResponseAdapter = (value) => {
        if (kind === 'responseAdapter' && fail) throw new Error('bad responseAdapter')
        return value as ReturnType<ResponseAdapter>
      }
      const { adapter, emit, core } = createRemoteTable({
        getResponseAdapter: () => responseAdapter,
      })
      await expect(adapter.reload()).resolves.toBeUndefined()
      expect(core.state.error).toBeInstanceOf(Error)
      expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'error' })
      fail = false
      await adapter.apply()
      expect(core.state.error).toBeNull()
      expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 2, status: 'success' })
      adapter.dispose()
    },
  )
})
