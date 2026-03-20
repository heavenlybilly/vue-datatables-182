// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePersistentState } from '~/usePersistentState'

export type Theme = 'light' | 'dark'

export const useHeaderStore = defineStore('playground-header-store', () => {
  const showTableParams = ref<boolean>(false)
  const theme = ref<Theme>('light')

  usePersistentState('playground-header-show-table-params', showTableParams)
  usePersistentState('playground-header-theme', theme)

  const setShowTableParams = (value: boolean) => {
    showTableParams.value = value
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    showTableParams,
    theme,
    setShowTableParams,
    toggleTheme,
  }
})
