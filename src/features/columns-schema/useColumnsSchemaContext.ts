import { useContext } from '@/composables/useContext'
import { contextKey } from './context-key'

export const useColumnsSchemaContext = () => {
  const { injectContext } = useContext(contextKey)
  return injectContext()
}
