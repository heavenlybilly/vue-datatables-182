// eslint-disable-next-line import/no-extraneous-dependencies
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useHeaderStore } from '~/core/header/store'

export const useHeader = () => {
  const store = useHeaderStore()
  const { headerBgColor, bodyBgColor, tableBgColor, showTableParams } = storeToRefs(store)

  const headerStyleObject = computed(() => ({
    'background-color': headerBgColor.value,
  }))

  const bodyStyleObject = computed(() => ({
    'background-color': bodyBgColor.value,
  }))

  const tableStyleObject = computed(() => ({
    'background-color': tableBgColor.value,
  }))

  return {
    headerBgColor,
    headerStyleObject,
    bodyBgColor,
    bodyStyleObject,
    tableBgColor,
    tableStyleObject,
    showTableParams,
    setHeaderBgColor: store.setHeaderBgColor,
    setBodyBgColor: store.setBodyBgColor,
    setTableBgColor: store.setTableBgColor,
    setShowTableParams: store.setShowTableParams,
  }
}
