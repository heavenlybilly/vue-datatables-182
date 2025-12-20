import { useContext } from '@/composables/useContext'
import { contextKey } from './context-key'

export const useDataParamsContext = () => {
  const { injectContext } = useContext(contextKey)
  return injectContext()
}
