import { Ref, computed, inject, provide, ref } from 'vue'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'

interface LoadingContext {
  loading: Ref<boolean>
  setLoading: (value: boolean) => void
}

const LoadingContextKey = Symbol('loading-context')

export const provideLoadingContext = () => {
  const loading = ref(false)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  provide(LoadingContextKey, {
    loading: computed(() => loading.value),
    setLoading,
  })

  return {
    loading,
    setLoading,
  }
}

export const useLoadingContext = () => {
  const context = inject<LoadingContext>(LoadingContextKey)

  if (!context) {
    throw new VueDatatables182Error(
      ErrorCategory.INTERNAL_ERROR,
      '`useLoading` must be used within `provideLoading`',
    )
  }

  return context
}
