import { Ref, ref } from 'vue'

export type TError = {
  message: string
}

export const useErrors = () => {
  const error: Ref<TError | null> = ref(null)

  const handleError = (value: Error | any) => {
    if (value instanceof Error) {
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
