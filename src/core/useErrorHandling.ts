import { Ref, onErrorCaptured, ref } from 'vue'
import { DTError } from '@/types/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'

export const useErrorHandling = () => {
  const error: Ref<DTError | null> = ref(null)

  const handleError = (value: Error | DTError | string | any) => {
    if (value instanceof VueDatatables182Error) {
      error.value = {
        message: value.message,
        description: value.description,
      }
    } else if (value instanceof Error) {
      error.value = {
        message: value.message,
      }
    } else if (typeof value === 'string') {
      error.value = {
        message: value,
      }
    } else {
      error.value = {
        message: 'Unknown error',
      }
    }

    throw value
  }

  const clearError = () => {
    error.value = null
  }

  onErrorCaptured((err) => {
    handleError(err)
  })

  return {
    error,
    handleError,
    clearError,
  }
}
