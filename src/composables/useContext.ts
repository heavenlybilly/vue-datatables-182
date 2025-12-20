import { InjectionKey, inject, provide } from 'vue'

export const useContext = <T extends object>(contextKey: InjectionKey<T>) => {
  const provideContext = (context: T) => {
    provide(contextKey, context)
  }

  const injectContext = (): T | null => {
    const ctx = inject(contextKey)
    return ctx ?? null
  }

  return {
    provideContext,
    injectContext,
  }
}
