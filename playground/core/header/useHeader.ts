// eslint-disable-next-line import/no-extraneous-dependencies
import { storeToRefs } from 'pinia'
import { useHeaderStore } from '~/core/header/store'

export const useHeader = () => {
  const store = useHeaderStore()
  const { showTableParams, theme } = storeToRefs(store)

  return {
    showTableParams,
    theme,
    setShowTableParams: store.setShowTableParams,
    toggleTheme: store.toggleTheme,
  }
}
