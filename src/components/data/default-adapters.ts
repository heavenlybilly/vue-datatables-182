import type { BuiltResponse, RequestAdapter, ResponseAdapter } from '../../types'

export const defaultRequestAdapter: RequestAdapter = ({ url, requestBody }) => ({
  url,
  method: 'POST',
  requestBody,
})

export const defaultResponseAdapter: ResponseAdapter = (response) => response as BuiltResponse
