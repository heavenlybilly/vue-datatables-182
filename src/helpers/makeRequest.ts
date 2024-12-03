import { DTMethod } from '@/types/types'

declare const window: {
  VUE_DATATABLES_182_GLOBALS: {
    token?: string
  }
} & Window

export default function makeRequest(
  url: string,
  method: DTMethod = 'GET',
  data: Record<string, any> = {},
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)

    if (method.toUpperCase() === 'POST') {
      if (window.VUE_DATATABLES_182_GLOBALS.token) {
        xhr.setRequestHeader('X-CSRF-Token', window.VUE_DATATABLES_182_GLOBALS.token)
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
      reject(new Error('Network error (makeRequest.ts)'))
    }

    if (data) {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  })
}
