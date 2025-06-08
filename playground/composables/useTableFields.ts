import { computed } from 'vue'
import { useFieldsState } from '~/composables/useFieldsState'
import { useTableRendering } from '~/composables/useTableRendering'
import { useTableStore } from '~/store/useTableStore'
import { FieldDef, TableItem } from '~/types'
import { Logger } from '~/utils/logger'

export const useTableFields = () => {
  const tableStore = useTableStore()
  const { reRender } = useTableRendering()
  const { retrieveFieldsState, storeFieldsState } = useFieldsState()

  const fields = computed(() => {
    return tableStore.fields
  })

  const setField = (name: string, value: FieldDef) => {
    const newFields = fields.value.map((field) => {
      return field.fieldName === name ? value : field
    })

    tableStore.setFields(newFields)

    storeFieldsState(tableStore.source, newFields)

    Logger.trigger('rendering', 'set field')
    reRender()
  }

  const extractFromLocal = (items: TableItem[]): FieldDef[] => {
    if (items.length === 0) {
      tableStore.setFields([])
      return []
    }

    return Object.keys(items[0]).map((item) => {
      return {
        fieldName: item,
        title: item,
        display: true,
        orderable: false,
        searchable: false,
      }
    })
  }

  const extractFromRemote = async (url: string): Promise<FieldDef[]> => {
    try {
      const response = await fetch(url)
      const json = await response.json()

      const firstItem = json.data?.[0] as TableItem | undefined

      if (firstItem) {
        return Object.keys(firstItem).map((item) => {
          return {
            fieldName: item,
            title: item,
            display: true,
            orderable: false,
            searchable: false,
          }
        }) as FieldDef[]
      }

      return []
    } catch (error) {
      console.error(error)
      return [] // Возвращаем пустой массив в случае ошибки
    }
  }

  const initFields = async () => {
    Logger.start('init fields')
    let newFields: FieldDef[] = []

    if (tableStore.source === 'local') {
      newFields = extractFromLocal(tableStore.tableParams.items)
    } else if (tableStore.source === 'remote') {
      newFields = await extractFromRemote(tableStore.tableParams.url ?? '')
    }

    const existedFields = retrieveFieldsState(tableStore.source)
    console.log(existedFields)

    const resultFields: FieldDef[] = newFields.map((field) => {
      const existedField = existedFields.find((item) => item.fieldName === field.fieldName)

      if (!existedField) {
        return field
      }

      return existedField
    })

    tableStore.setFields(resultFields)
    Logger.end('init fields')

    Logger.trigger('rendering', 'finish init fields')
    reRender()
  }

  return {
    fields,
    setField,
    initFields,
  }
}
