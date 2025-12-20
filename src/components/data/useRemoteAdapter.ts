import { buildRequestContext } from './build-request-context'
import { defaultRequestAdapter, defaultResponseAdapter } from './default-adapters'
import { makeSnapshot } from './helpers'
import { prepareRequest } from './prepare-request'
import { useRequestLifecycle } from './request-lifecycle'
import type { RemoteAdapterOptions } from './types'
import { untilAborted } from './until-aborted'
import { responsePage, validateResponse } from './validate-response'

export const useRemoteAdapter = (options: RemoteAdapterOptions) => {
  const lifecycle = useRequestLifecycle(options)
  let completedSnapshot = ''
  let activeSnapshot = ''
  let requestIdentity = options.getRequestAdapter()
  let responseIdentity = options.getResponseAdapter()
  let csrfIdentity = options.getCsrfToken()

  const cancel = () => {
    activeSnapshot = ''
    lifecycle.cancel()
  }

  const doRequest = async (force: boolean, correcting = false): Promise<void> => {
    if (lifecycle.disposed) {
      return
    }

    const requestAdapter = options.getRequestAdapter() ?? defaultRequestAdapter
    const responseAdapter = options.getResponseAdapter() ?? defaultResponseAdapter
    const csrf = options.getCsrfToken()

    if (
      requestIdentity !== requestAdapter ||
      responseIdentity !== responseAdapter ||
      csrfIdentity !== csrf
    ) {
      completedSnapshot = ''
      activeSnapshot = ''
      requestIdentity = requestAdapter
      responseIdentity = responseAdapter
      csrfIdentity = csrf
    }

    let context
    let snapshot = ''
    let contextError: unknown

    try {
      context = buildRequestContext(options)
      snapshot = makeSnapshot(context)
    } catch (error: unknown) {
      contextError = error
    }

    if (context && !force && snapshot === activeSnapshot) {
      return
    }

    if (context && !force && snapshot === completedSnapshot) {
      cancel()

      return
    }

    cancel()

    const { requestId, controller } = lifecycle.begin()

    activeSnapshot = snapshot

    try {
      if (!context) {
        throw contextError
      }

      const { request, init } = prepareRequest(requestAdapter(context), csrf)

      if (!lifecycle.current(requestId)) {
        return
      }

      options.emit('requestStart', {
        requestId,
        request,
      })

      if (!lifecycle.current(requestId)) {
        return
      }

      const response = await untilAborted(
        fetch(request.url, {
          ...init,
          signal: controller.signal,
        }),
        controller.signal,
      )

      if (!response || !lifecycle.current(requestId)) {
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const raw = await untilAborted(response.json(), controller.signal)

      if (!lifecycle.current(requestId)) {
        return
      }

      const data = validateResponse(
        responseAdapter(raw),
        context,
        options.core.state.rowKeySelector,
      )
      const page = responsePage(data, context)
      const needsCorrection = context.pagination && page !== context.requestBody.page

      if (needsCorrection && correcting) {
        throw new Error('response page remains out of range after correction')
      }

      if (!needsCorrection) {
        options.core.setTableData(data)

        if (!lifecycle.current(requestId)) {
          return
        }

        completedSnapshot = snapshot
      }

      if (!lifecycle.current(requestId)) {
        return
      }

      activeSnapshot = ''
      lifecycle.finish(requestId, 'success', () => {
        options.emit('requestSuccess', {
          requestId,
          data,
        })
      })

      if (needsCorrection && lifecycle.idle(requestId)) {
        options.core.correctPage(page)

        if (lifecycle.idle(requestId)) {
          await doRequest(true, true)
        }
      }
    } catch (error: unknown) {
      if (!lifecycle.current(requestId)) {
        return
      }

      completedSnapshot = ''
      activeSnapshot = ''
      options.core.setError(error)
      lifecycle.finish(requestId, 'error', () => {
        options.emit('requestError', {
          requestId,
          error,
        })
      })
    }
  }

  return {
    apply: () => doRequest(false),
    reload: () => doRequest(true),
    cancel: () => {
      cancel()
      completedSnapshot = ''
    },
    dispose: () => {
      activeSnapshot = ''
      lifecycle.dispose()
    },
  }
}
