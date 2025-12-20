import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRemoteTable, deferred, mockFetch, mockResponse } from './helpers/remote-table'

describe('remote event reentry', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each(['requestSuccess', 'requestError'])(
    'keeps the completed status and new loading when %s starts a reload',
    async (event) => {
      const pending = deferred<Response>()
      const fetch = mockFetch()
      if (event === 'requestError') fetch.mockRejectedValueOnce(new Error('offline'))
      else fetch.mockResolvedValueOnce(mockResponse({ items: [{ id: 1 }], total: 1 }))
      fetch.mockReturnValueOnce(pending.promise)
      const { adapter, core, emit } = createRemoteTable()
      let second!: Promise<void>
      emit.mockImplementation((name, payload) => {
        if (name === event && payload.requestId === 1) second = adapter.reload()
      })
      await adapter.reload()
      expect(core.state.isLoading).toBe(true)
      expect(emit).toHaveBeenCalledWith('requestEnd', {
        requestId: 1,
        status: event === 'requestSuccess' ? 'success' : 'error',
      })
      expect(emit).not.toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'aborted' })
      pending.resolve(mockResponse({ items: [{ id: 2 }], total: 1 }))
      await second
      expect(core.state.tableData.items).toEqual([{ id: 2 }])
      expect(core.state.isLoading).toBe(false)
      expect(core.state.error).toBeNull()
      adapter.dispose()
    },
  )
})
