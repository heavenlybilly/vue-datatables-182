import { computed } from 'vue'
import { useTableFields } from '~/composables/useTableFields'
import { useTableStore } from '~/store/useTableStore'
import { Logger } from '~/utils/logger'
import { DTSource } from '@/types'

export const useTableSource = () => {
  const tableStore = useTableStore()
  const { initFields } = useTableFields()

  const source = computed(() => {
    return tableStore.source
  })

  const setSource = async (value: DTSource) => {
    tableStore.setSource(value)
    Logger.trigger('init fields', 'set source')
    await initFields()
  }

  return {
    source,
    setSource,
  }
}
