import { Logger } from '@/logger'
import { ColumnKind } from '../columns'
import { RequestContext } from '../types'
import { makeSnapshot } from './helpers'
import { RemoteAdapterOptions } from './types'

export const useRemoteAdapter = (options: RemoteAdapterOptions) => {
  let prevSnapshot = ''
  let inFlight: AbortController | null = null

  const buildContext = () => {
    const url = options.getUrl()

    if (!url) {
      return null
    }

    const { state } = options.core

    let orderBy: string | undefined
    let orderDirection = state.sort.direction ?? undefined

    if (state.sort.by) {
      const column = options.columnRegistry.columns.find((c) => {
        return c.key === state.sort.by && c.kind === ColumnKind.DATA
      })

      if (column?.field) {
        orderBy = column.field
      } else {
        orderBy = undefined
        orderDirection = undefined
      }
    }

    const requestBody: RequestContext['requestBody'] = {
      page: state.page,
      perPage: state.rowsPerPageCount,
      search: state.searchQuery?.trim() ? state.searchQuery.trim() : undefined,
      orderBy,
      orderDirection,
      filter: options.getFilter(),
    }

    return { url, requestBody }
  }

  const doRequest = async (force: boolean) => {
    const ctx = buildContext()

    if (!ctx) {
      return
    }

    const snapshot = makeSnapshot(ctx)
    if (!force && snapshot === prevSnapshot) {
      return
    }

    if (inFlight) {
      inFlight.abort()
    }

    inFlight = new AbortController()

    const requestAdapter = options.getRequestAdapter()
    if (!requestAdapter) {
      Logger.error('Request adapter is not defined')
      throw new Error('Request adapter is not defined')
    }

    const request = requestAdapter(ctx)

    const headers: Record<string, string> = { ...(request.headers ?? {}) }

    const csrf = options.getCsrfToken()
    if (csrf) {
      headers['X-CSRF-TOKEN'] = csrf
    }

    try {
      options.core.setError(null)
      options.core.setLoading(true)

      options.emit('requestStart', request)

      const response = await fetch(request.url, {
        method: 'post',
        headers,
        body: request.requestBody ? JSON.stringify(request.requestBody) : undefined,
        signal: inFlight.signal,
      })

      if (!response.ok) {
        const message = `Request failed with status ${response.status}`

        Logger.error(message)
        throw new Error(message)
      }

      const raw = await response.json()

      const responseAdapter = options.getResponseAdapter()
      if (!responseAdapter) {
        Logger.error('Response adapter is not defined')
        throw new Error('Response adapter is not defined')
      }

      const data = responseAdapter(raw)

      options.core.setTableData(data)
      options.emit('requestEnd', { ok: true })
      options.emit('requestSuccess', data)

      prevSnapshot = snapshot
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return
      }

      options.core.setError(error)
      options.emit('requestError', error)
      options.emit('requestEnd', { ok: false })
    } finally {
      options.core.setLoading(false)
    }
  }

  return {
    apply: () => doRequest(false),
    reload: () => doRequest(true),
  }
}
