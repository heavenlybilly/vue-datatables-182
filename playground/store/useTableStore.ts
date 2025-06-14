// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePersistentState } from '~/composables/usePersistentState'
import { FieldDef, ToolbarTableParams } from '~/types'
import { Logger } from '~/utils/logger'
import { DTSource } from '@/types/types'

export const useTableStore = defineStore('table', () => {
  const source = ref<DTSource>(DTSource.LOCAL)
  const fields = ref<FieldDef[]>([])
  const isTableVisible = ref(false)

  const tableParams = ref<ToolbarTableParams>({
    url: null,
    items: [],
    paginationEnabled: true,
    rowPerPageOptionsRaw: '5, 10, 25, 50, 100',
    rowsPerPage: 10,
    orderBy: null,
    orderDirection: 'desc',
    searching: true,
    rowSelection: false,
    actions: false,
    numbering: false,
    rowsClickable: false,
    scrollX: false,
    fixedColumnsStart: 0,
    fixedColumnsEnd: 0,
  })

  usePersistentState('playground-source', source)
  usePersistentState('playground-table-params', tableParams)

  const setSource = (value: DTSource) => {
    source.value = value
    Logger.store('set source', value)
  }

  const setFields = (value: FieldDef[]) => {
    fields.value = value
    Logger.store('set fields', [...value])
  }

  const setTableVisible = (value: boolean) => {
    isTableVisible.value = value
    Logger.store('set is table visible', value)
  }

  const setTableParams = (value: Partial<ToolbarTableParams>) => {
    tableParams.value = {
      ...tableParams.value,
      ...value,
    }
    Logger.store('set table params', { ...value })
  }

  return {
    source,
    fields,
    isTableVisible,
    tableParams,
    setSource,
    setFields,
    setTableVisible,
    setTableParams,
  }
})
