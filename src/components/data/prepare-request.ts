import type { BuiltRequest } from '../../types'
import { assertJsonValue, isPlainObject } from './json-value'

export const prepareRequest = (value: BuiltRequest, csrf?: string) => {
  if (!isPlainObject(value) || typeof value.url !== 'string' || !value.url.trim()) {
    throw new Error('requestAdapter must return a request with a non-empty url')
  }

  const method = value.method ?? 'POST'

  if (method !== 'GET' && method !== 'POST') {
    throw new Error('request method must be GET or POST')
  }

  const credentials = value.credentials ?? 'same-origin'

  if (!['omit', 'same-origin', 'include'].includes(credentials)) {
    throw new Error('request credentials must be omit, same-origin or include')
  }

  if (method === 'GET' && value.requestBody !== undefined) {
    throw new Error('GET request must not contain requestBody')
  }

  if (value.headers !== undefined && !isPlainObject(value.headers)) {
    throw new Error('request headers must be a record of strings')
  }

  const headers = new Headers()

  Object.entries(value.headers ?? {}).forEach(([key, header]) => {
    if (typeof header !== 'string') {
      throw new Error('request headers must contain strings')
    }

    headers.set(key, header)
  })

  let body: string | undefined

  if (value.requestBody !== undefined) {
    assertJsonValue(value.requestBody, 'requestBody')
    body = JSON.stringify(value.requestBody)

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  if (csrf && method === 'POST' && typeof window !== 'undefined') {
    const url = new URL(value.url, window.location.href)

    if (url.origin === window.location.origin && !headers.has('X-CSRF-TOKEN')) {
      headers.set('X-CSRF-TOKEN', csrf)
    }
  }

  const normalizedHeaders: Record<string, string> = {}

  headers.forEach((header, name) => {
    normalizedHeaders[name] = header
  })

  const request: BuiltRequest = {
    ...value,
    method,
    credentials,
    headers: normalizedHeaders,
  }
  const init: RequestInit = {
    method,
    credentials,
    headers: request.headers,
    body,
  }

  return {
    request,
    init,
  }
}
