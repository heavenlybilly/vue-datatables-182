import { DomainError } from '@/DomainError'
import { DTError } from '@/types'
import { Ref, ref } from 'vue'

export const useErrors = () => {
  const error: Ref<DTError | null> = ref(null)

  const handleError = (value: Error | DTError | string | any) => {
    if (value instanceof DomainError) {
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

  return {
    error,
    handleError,
    clearError,
  }
}
