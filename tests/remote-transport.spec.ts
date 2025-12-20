import { afterEach, describe, expect, it, vi } from 'vitest'
import { prepareRequest } from '../src/components/data/prepare-request'
import type { BuiltRequest, RequestAdapter } from '../src/types'
import { createRemoteTable, mockFetch } from './helpers/remote-table'

describe('remote transport', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('works without plugin adapters and emits normalized lifecycle payloads in order', async () => {
    const fetch = mockFetch()
    const { adapter, core, emit } = createRemoteTable()
    await adapter.apply()
    expect(fetch.mock.calls[0]).toEqual([
      '/users',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page: 1, perPage: 25, filter: {} }),
      }),
    ])
    expect(core.state.tableData).toEqual({ items: [{ id: 1 }], total: 1, filtered: 1 })
    expect(emit.mock.calls.map(([event]) => event)).toEqual([
      'requestStart',
      'requestSuccess',
      'requestEnd',
    ])
    expect(emit).toHaveBeenCalledWith('requestSuccess', {
      requestId: 1,
      data: core.state.tableData,
    })
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'success' })
    await adapter.apply()
    expect(fetch).toHaveBeenCalledTimes(1)
    adapter.dispose()
  })

  it('honors custom GET URL, headers and credentials without injecting body or content type', async () => {
    const fetch = mockFetch()
    const requestAdapter: RequestAdapter = ({ url, requestBody }) => ({
      url: `${url}?page=${requestBody.page}`,
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    const { adapter } = createRemoteTable({
      getRequestAdapter: () => requestAdapter,
      getCsrfToken: () => 'secret',
    })
    await adapter.apply()
    expect(fetch.mock.calls[0]).toEqual([
      '/users?page=1',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
        headers: { accept: 'application/json' },
        body: undefined,
      }),
    ])
    adapter.dispose()
  })

  it.each([false, 0, '', null])('serializes a falsy POST body %s', (body) => {
    const { init } = prepareRequest({ url: '/users', requestBody: body })
    expect(init.body).toBe(JSON.stringify(body))
    expect(init.headers).toEqual({ 'content-type': 'application/json' })
  })

  it('respects case-insensitive adapter headers and never mutates the input', () => {
    const value = Object.freeze({
      url: '/users',
      requestBody: {},
      headers: Object.freeze({ 'cOnTeNt-TyPe': 'custom', 'x-csrf-token': 'explicit' }),
    })
    const { init } = prepareRequest(value, 'automatic')
    expect(init.headers).toEqual({ 'content-type': 'custom', 'x-csrf-token': 'explicit' })
    expect(value.headers).toHaveProperty('cOnTeNt-TyPe', 'custom')
  })

  it('adds automatic CSRF only to same-origin POST requests', () => {
    expect(prepareRequest({ url: '/users' }, 'secret').init.headers).toEqual({
      'x-csrf-token': 'secret',
    })
    expect(
      prepareRequest({ url: `${window.location.origin}/users` }, 'secret').init.headers,
    ).toEqual({ 'x-csrf-token': 'secret' })
    expect(
      prepareRequest({ url: 'https://external.example/users' }, 'secret').init.headers,
    ).toEqual({})
    expect(prepareRequest({ url: '/users', method: 'GET' }, 'secret').init.headers).toEqual({})
    expect(prepareRequest({ url: '/users' }).init.headers).toEqual({})
  })

  it.each([
    { url: '' },
    { url: '/users', method: 'PUT' },
    { url: '/users', credentials: 'bad' },
    { url: '/users', method: 'GET', requestBody: null },
    { url: '/users', requestBody: new FormData() },
    { url: '/users', headers: { Test: 1 } },
  ])('reports an invalid BuiltRequest before requestStart: %j', async (request) => {
    const fetch = mockFetch()
    const { adapter, emit } = createRemoteTable({
      getRequestAdapter: () => () => request as BuiltRequest,
    })
    await expect(adapter.reload()).resolves.toBeUndefined()
    expect(fetch).not.toHaveBeenCalled()
    expect(emit.mock.calls.map(([event]) => event)).toEqual(['requestError', 'requestEnd'])
    expect(emit).toHaveBeenCalledWith('requestEnd', { requestId: 1, status: 'error' })
    adapter.dispose()
  })
})
