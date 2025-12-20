import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRemoteAdapter } from '../src/components/data/useRemoteAdapter'
import { createCore } from './helpers/create-core'

describe('remote error payload', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retries an earlier successful context after another context failed', async () => {
    const response = { ok: true, json: async () => null }
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(response)
    vi.stubGlobal('fetch', fetch)
    const { core, columnRegistry, emit } = createCore()
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getCsrfToken: () => undefined,
      getRequestAdapter:
        () =>
        ({ url, requestBody }) => ({ url, requestBody }),
      getResponseAdapter: () => () => ({ items: [], total: 0 }),
    })
    await adapter.apply()
    core.setSearchQuery('new')
    await adapter.apply()
    core.setSearchQuery('')
    await adapter.apply()
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(core.state.error).toBeNull()
    adapter.dispose()
  })

  it('emits the declared error envelope and finishes loading after a transport failure', async () => {
    const error = new Error('offline')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error))
    const { core, columnRegistry, emit } = createCore()
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getRequestAdapter:
        () =>
        ({ url, requestBody }) => ({ url, requestBody }),
      getResponseAdapter: () => () => ({ items: [], total: 0 }),
      getCsrfToken: () => undefined,
    })

    await adapter.apply()

    expect(emit.mock.calls.map(([event]) => event)).toEqual([
      'requestStart',
      'requestError',
      'requestEnd',
    ])
    expect(emit).toHaveBeenCalledWith('requestError', { requestId: 1, error })
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'error' })
    expect(core.state.error).toBe(error)
    expect(core.state.isLoading).toBe(false)
  })
})
