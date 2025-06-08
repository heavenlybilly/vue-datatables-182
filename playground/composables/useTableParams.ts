import { computed } from 'vue'
import { useTableRendering } from '~/composables/useTableRendering'
import { useTableStore } from '~/store/useTableStore'
import { ToolbarTableParams } from '~/types'
import { Logger } from '~/utils/logger'

export const useTableParams = () => {
  const tableStore = useTableStore()
  const { reRender } = useTableRendering()

  const tableParams = computed(() => {
    return tableStore.tableParams
  })

  const displayedRowsPerPageOptions = computed(() => {
    if (!tableParams.value.rowPerPageOptionsRaw) {
      return undefined
    }

    return tableParams.value.rowPerPageOptionsRaw
      .split(',')
      .map((item) => +item.trim())
      .filter((num) => Number.isInteger(num) && num > 0)
  })

  const setTableParams = (value: Partial<ToolbarTableParams>) => {
    tableStore.setTableParams(value)
    Logger.trigger('rendering', 'set table params')
    reRender()
  }

  return {
    tableParams,
    displayedRowsPerPageOptions,
    setTableParams,
  }
}
