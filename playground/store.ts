// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { toolbarControls } from '~/toolbar-controls'
import { FieldDef } from '~/types'
import { usePersistentState } from '~/usePersistentState'
import { Logger } from '~/utils/logger'

export const useStore = defineStore('playground-store', () => {
  const tableKey = ref(1)
  const fields = ref<FieldDef[]>([])
  const tableParams = ref<Record<string, unknown>>({})

  usePersistentState('playground-table-params', tableParams)

  const source = computed(() => {
    return tableParams.value.source
  })

  const setTableKey = (value: number) => {
    tableKey.value = value
    Logger.store('set table key', value)
  }

  const setFields = (value: FieldDef[]) => {
    fields.value = value
    Logger.store('set fields', [...value])
  }

  const setTableParams = (value: Record<string, unknown>) => {
    tableParams.value = {
      ...tableParams.value,
      ...value,
    }
    Logger.store('set table params', { ...value })
  }

  onMounted(() => {
    toolbarControls.forEach((group) => {
      group.controls.forEach((control) => {
        if (tableParams.value[control.name] === undefined) {
          tableParams.value = {
            ...tableParams.value,
            [control.name]: control?.params?.defaultValue ?? undefined,
          }
        }
      })
    })
  })

  return {
    source,
    fields,
    tableKey,
    tableParams,
    setFields,
    setTableKey,
    setTableParams,
  }
})
