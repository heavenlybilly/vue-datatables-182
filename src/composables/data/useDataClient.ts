import { Ref } from 'vue'
import { DTColumn, DTOrder, DTRowItem, DTTableData } from '@/types/types'
import filterItemsBySearch from '@/composables/data/helpers/filterItemsBySearch'
import getItemsByPage from '@/composables/data/helpers/getItemsByPage'
import orderItems from '@/composables/data/helpers/orderItems'

export const useDataClient = () => {
  const processItems = (
    items: Ref<DTRowItem[]>,
    columns: Ref<DTColumn[]>,
    params: {
      search: Ref<string>
      searching: Ref<boolean>
      pagination: Ref<boolean>
      rowsPerPage: Ref<number>
      page: Ref<number>
      order: Ref<DTOrder | null>
    },
  ): DTTableData => {
    const total = items.value.length
    let processingItems = items.value

    // searching
    if (params.searching.value) {
      const searchableColumnNames = columns.value
        .filter((colum) => {
          return colum.params.searchable
        })
        .map((colum) => colum.params.field)

      processingItems = filterItemsBySearch(items.value, params.search.value, searchableColumnNames)
    }

    const filtered = processingItems.length

    // ordering
    if (params.order.value) {
      processingItems = orderItems(
        processingItems,
        params.order.value.column,
        params.order.value.direction,
      )
    }

    // paginating
    if (params.pagination.value) {
      processingItems = getItemsByPage(
        processingItems,
        params.page.value,
        params.rowsPerPage.value,
      ) as DTRowItem[]
    }

    let numberOffset = 0

    if (params.pagination.value) {
      numberOffset = (params.page.value - 1) * params.rowsPerPage.value
    }

    const rows = processingItems.map((item, index) => ({
      index,
      item,
      number: index + 1 + numberOffset,
    }))

    return {
      total,
      filtered,
      rows,
    }
  }

  return {
    processItems,
  }
}
