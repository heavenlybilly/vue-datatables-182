import { Ref } from 'vue'
import { DTColumn, DTOrder, DTRowItem, DTTableData } from '@/types/types'
import makeQueryParams from '@/composables/data/helpers/makeQueryParams'
import { DomainError } from '@/errors/DomainError'

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
      throw new DomainError('Prop url is not defined')
    }

    const queryParams = makeQueryParams({
      page: params.page.value,
      rowsPerPage: params.pagination.value ? params.rowsPerPage.value : null,
      columns: columns.value,
      search: params.search.value,
      order: params.order.value,
    })

    const response = await fetch(`${url.value}?${queryParams}`)
    if (!response.ok) {
      let description: string | null

      try {
        description = JSON.stringify(await response.json())
      } catch (error) {
        description = null
      }

      throw new DomainError('Error occurred during fetching remote data', description)
    }
    const data = await response.json()

    if (data?.error) {
      throw new DomainError('Error occurred during fetching remote data', data.error)
    }

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
