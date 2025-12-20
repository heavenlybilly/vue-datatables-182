import { vi } from 'vitest'
import type { RemoteAdapterOptions } from '../../src/components/data/types'
import { useRemoteAdapter } from '../../src/components/data/useRemoteAdapter'
import type { DataTableProps } from '../../src/types'
import { createCore } from './create-core'

export const createRemoteTable = (
  overrides: Partial<RemoteAdapterOptions> = {},
  props: DataTableProps = { rowKey: 'id' },
) => {
  const state = createCore(props)
  const options: RemoteAdapterOptions = {
    ...state,
    getUrl: () => '/users',
    getFilter: () => ({}),
    getRequestAdapter: () => undefined,
    getResponseAdapter: () => undefined,
    getCsrfToken: () => undefined,
    ...overrides,
  }
  return { ...state, options, adapter: useRemoteAdapter(options) }
}

export const mockResponse = (data: unknown) => ({ ok: true, json: async () => data }) as Response
export const mockFetch = (data: unknown = { items: [{ id: 1 }], total: 1 }) => {
  const fetch = vi.fn().mockResolvedValue(mockResponse(data))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

export const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
