import { DTColumn, DTFilter, DTOrder, DTRowItem, DTTableData } from '@/types/types'
import filterItemsBySearch from '@/core/table-data/local/filter-items-by-search'
import getItemsByPage from '@/core/table-data/local/get-items-by-page'
import orderItems from '@/core/table-data/local/order-items'

export const processLocalItems = (
  localConf: {
    items: DTRowItem[]
  },
  conf: {
    columns: DTColumn[]
    searching: boolean
    pagination: boolean
  },
  params: {
    search: string
    rowsPerPage: number
    page: number
    order: DTOrder | null
    filters: DTFilter | null
  },
): DTTableData => {
  let processingItems = [...localConf.items]

  // searching
  if (conf.searching) {
    const searchableColumnNames = conf.columns
      .filter((colum) => {
        return colum.params.searchable
      })
      .map((colum) => colum.params.field)

    processingItems = filterItemsBySearch(processingItems, params.search, searchableColumnNames)
  }

  const filtered = processingItems.length

  // ordering
  if (params.order) {
    processingItems = orderItems(processingItems, params.order.column, params.order.direction)
  }

  // paginating
  if (conf.pagination) {
    processingItems = getItemsByPage(
      processingItems,
      params.page,
      params.rowsPerPage,
    ) as DTRowItem[]
  }

  let numberOffset = 0

  if (conf.pagination) {
    numberOffset = (params.page - 1) * params.rowsPerPage
  }

  const rows = processingItems.map((item, index) => ({
    index,
    item,
    number: index + 1 + numberOffset,
  }))

  return {
    total: localConf.items.length,
    filtered,
    rows,
  }
}
