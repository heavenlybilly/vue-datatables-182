import { Ref } from 'vue'
import makeQueryParams from '@/composables/data/helpers/makeQueryParams'
import { DTColumn, DTOrder, DTRowItem, DTTableData } from '@/types'

export const useDataServer = () => {
  const fetchRemoteItems = async (
    url: Ref<string | null>,
    columns: Ref<DTColumn[]>,
    params: {
      searching: Ref<boolean>
      search: Ref<string>
      pagination: Ref<boolean>
      rowsPerPage: Ref<number>
      page: Ref<number>
      order: Ref<DTOrder | null>
    },
  ): Promise<DTTableData> => {
    if (!url.value) {
      throw new Error('Prop url is not defined')
    }

    const queryParams = makeQueryParams({
      page: params.page.value,
      rowsPerPage: params.pagination.value ? params.rowsPerPage.value : null,
      columns: columns.value,
      search: params.search.value,
      order: params.order.value,
    })

    const response = await fetch(`${url.value}?${queryParams}`)
    const data = await response.json()

    let numberOffset = 0

    if (params.pagination.value) {
      numberOffset = (params.page.value - 1) * params.rowsPerPage.value
    }

    const rows = data.data.map((item: DTRowItem, index: number) => {
      return {
        index,
        item,
        number: index + 1 + numberOffset,
      }
    })

    return {
      rows,
      total: data.recordsTotal,
      filtered: data.recordsFiltered,
    }
  }

  return {
    fetchRemoteItems,
  }
}
