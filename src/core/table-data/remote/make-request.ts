import { DTMethod } from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'
import { getCsrfToken } from '@/plugin/csrf-token'

export default function makeRequest(url: string, method: DTMethod, data: Record<string, any> = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)

    if (method.toUpperCase() === DTMethod.POST) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        xhr.setRequestHeader('X-CSRF-Token', csrfToken)
      }

      xhr.setRequestHeader('Content-Type', 'application/json')
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(xhr.statusText))
      }
    }

    xhr.onerror = () => {
      reject(
        new VueDatatables182Error(
          ErrorCategory.NETWORK_ERROR,
          'Network error occurred while sending the request.',
        ),
      )
    }

    xhr.ontimeout = () => {
      reject(
        new VueDatatables182Error(
          ErrorCategory.NETWORK_ERROR,
          'Request timed out. No response from the server.',
        ),
      )
    }

    xhr.onabort = () => {
      reject(new VueDatatables182Error(ErrorCategory.NETWORK_ERROR, 'Request was aborted.'))
    }

    if (data) {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  })
}
