// eslint-disable-next-line import/no-extraneous-dependencies
import { storeToRefs } from 'pinia'
import { useStore } from '~/store'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'

export const useTableParams = () => {
  const store = useStore()
  const { tableParams } = storeToRefs(store)

  const { reRender } = useTableRendering()

  const setTableParams = (value: Record<string, unknown>) => {
    store.setTableParams(value)
    Logger.trigger('rendering', 'set table params')
    reRender()
  }

  return {
    tableParams,
    setTableParams,
  }
}
