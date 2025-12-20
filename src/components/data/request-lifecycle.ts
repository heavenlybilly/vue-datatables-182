import type { RequestEndPayload } from '../../types'
import type { RemoteAdapterOptions } from './types'

export const useRequestLifecycle = ({ core, emit }: RemoteAdapterOptions) => {
  let nextId = 0
  let disposed = false
  let active: {
    requestId: number
    controller: AbortController
  } | null = null

  const current = (requestId: number) => !disposed && active?.requestId === requestId

  const finish = (requestId: number, status: RequestEndPayload['status'], notify: () => void) => {
    if (!current(requestId)) {
      return
    }

    active = null
    core.setLoading(false)
    notify()

    if (!disposed) {
      emit('requestEnd', {
        requestId,
        status,
      })
    }
  }

  const cancel = () => {
    const attempt = active

    if (!attempt) {
      return
    }

    active = null
    attempt.controller.abort()
    core.setLoading(false)

    if (!disposed) {
      emit('requestEnd', {
        requestId: attempt.requestId,
        status: 'aborted',
      })
    }
  }

  const begin = () => {
    cancel()
    nextId += 1

    const attempt = {
      requestId: nextId,
      controller: new AbortController(),
    }

    active = attempt
    core.setError(null)
    core.setLoading(true)

    return attempt
  }

  return {
    begin,
    current,
    idle: (requestId: number) => !disposed && active === null && nextId === requestId,
    finish,
    cancel,
    get disposed() {
      return disposed
    },
    dispose: () => {
      disposed = true
      cancel()
    },
  }
}
