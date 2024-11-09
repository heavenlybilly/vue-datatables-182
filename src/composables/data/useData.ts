import { Ref, ref } from 'vue'
import { useDataClient } from '@/composables/data/useDataClient'
import { useDataServer } from '@/composables/data/useDataServer'
import {
  DTColumn,
  DTDataSource,
  DTOrder,
  DTRowItem,
  DTTableData,
} from '@/types'

export const useData = (
  dataSource: Ref<DTDataSource>,
  url: Ref<string | null>,
  items: Ref<DTRowItem[]>,
  columns: Ref<DTColumn[]>,
  params: {
    searching: Ref<boolean>
    search: Ref<string>
    pagination: Ref<boolean>
    rowsPerPage: Ref<number>
    page: Ref<number>
    order: Ref<DTOrder | null>
  },
) => {
  const tableData: Ref<DTTableData | null> = ref(null)

  const { processItems } = useDataClient()
  const { fetchRemoteItems } = useDataServer()

  const fetchTableData = async () => {
    switch (dataSource.value) {
      case 'client':
        tableData.value = processItems(items, columns, params)
        break
      case 'server':
        tableData.value = await fetchRemoteItems(url, columns, params)
        break
      default:
        throw new Error('Unknown prop dataSource value')
    }
  }

  return {
    tableData,
    fetchTableData,
  }
}
