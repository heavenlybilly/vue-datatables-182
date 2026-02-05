// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePersistentState } from '~/usePersistentState'

export const useHeaderStore = defineStore('playground-header-store', () => {
  const headerBgColor = ref<string>('#fff')
  const bodyBgColor = ref<string>('#fff')
  const tableBgColor = ref<string>('#fff')
  const showTableParams = ref<boolean>(false)

  usePersistentState('playground-header-header-bg-color', headerBgColor)
  usePersistentState('playground-header-body-bg-color', bodyBgColor)
  usePersistentState('playground-header-table-bg-color', tableBgColor)
  usePersistentState('playground-header-show-table-params', showTableParams)

  const setHeaderBgColor = (value: string) => {
    headerBgColor.value = value
  }

  const setBodyBgColor = (value: string) => {
    bodyBgColor.value = value
  }

  const setTableBgColor = (value: string) => {
    tableBgColor.value = value
  }

  const setShowTableParams = (value: boolean) => {
    showTableParams.value = value
  }

  return {
    headerBgColor,
    bodyBgColor,
    tableBgColor,
    showTableParams,
    setHeaderBgColor,
    setBodyBgColor,
    setTableBgColor,
    setShowTableParams,
  }
})
