import { computed } from 'vue'
import { useTableStore } from '~/store/useTableStore'
import { Logger } from '~/utils/logger'

let firstRender = true
let rendering = false

export const useTableRendering = () => {
  const tableStore = useTableStore()

  const isTableVisible = computed(() => {
    return tableStore.isTableVisible
  })

  const reRender = () => {
    if (firstRender) {
      Logger.info('first rendering')
      firstRender = false
      tableStore.setTableVisible(true)

      return
    }

    if (!isTableVisible.value || rendering) {
      return
    }

    Logger.start('rendering')
    rendering = true
    tableStore.setTableVisible(false)

    setTimeout(() => {
      rendering = false
      tableStore.setTableVisible(true)
      Logger.end('rendering')
    }, 200)
  }

  return {
    reRender,
    isTableVisible,
  }
}
