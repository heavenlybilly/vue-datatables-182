import { onErrorCaptured } from 'vue'
import { DTError } from '@/types'
import { Logger } from '@/logger'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'

export const useErrorHandling = () => {
  const handleError = (value: Error | DTError | string | any) => {
    if (value instanceof VueDatatables182Error) {
      Logger.error(value.message, value.description)
    } else if (value instanceof Error) {
      Logger.error(value.message)
    } else if (typeof value === 'string') {
      Logger.error(value)
    } else {
      Logger.error('Unknown error')
    }

    throw value
  }

  onErrorCaptured((err) => {
    handleError(err)
  })

  return {
    handleError,
  }
}
