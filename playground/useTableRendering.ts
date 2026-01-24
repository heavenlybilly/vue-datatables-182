// eslint-disable-next-line import/no-extraneous-dependencies
import { storeToRefs } from 'pinia'
import { useStore } from '~/store'

export const useTableRendering = () => {
  const store = useStore()
  const { tableKey } = storeToRefs(store)

  const reRender = () => {
    store.setTableKey(tableKey.value + 1)
  }

  return {
    tableKey,
    reRender,
  }
}
