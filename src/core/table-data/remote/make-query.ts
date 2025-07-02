import { DTColumn, DTFilter, DTOrder } from '@/types'

const fromPageParams = (page: number, rowsPerPage: number | null) => {
  if (rowsPerPage) {
    return {
      start: (page - 1) * rowsPerPage,
      length: rowsPerPage,
    }
  }

  return { start: 1 }
}

const fromSearch = (search: string | null) => {
  return {
    search: { regex: false, value: search ? encodeURIComponent(search) : '' },
  }
}

const fromOrder = (order: DTOrder | null, columns: DTColumn[]) => {
  if (!order) {
    return {}
  }

  const column = columns.find((item) => {
    return item.params.field === order.column
  })

  if (!column) {
    return {}
  }

  return {
    order: [{ column: column.index, dir: order.direction }],
  }
}

const fromColumns = (columns: DTColumn[]) => {
  const requestColumns = columns.reduce(
    (carry, column) => {
      return [
        ...carry,
        {
          data: column.params.field,
          name: column.params.field,
          orderable: column.params.orderable,
          searchable: column.params.searchable,
          search: { value: '', regex: false },
        },
      ]
    },
    [] as Record<string, any>[],
  )
  return { columns: requestColumns }
}

export default (params: {
  page: number
  rowsPerPage: number | null
  columns: DTColumn[]
  search: string
  order: DTOrder | null
  filters: DTFilter | null
}) => {
  const queryPage = fromPageParams(params.page, params.rowsPerPage)
  const queryColumns = fromColumns(params.columns)
  const querySearch = fromSearch(params.search)
  const queryOrder = fromOrder(params.order, params.columns)
  let queryFilter = {}
  if (params.filters) {
    queryFilter = { filters: params.filters }
  }

  // return `${queryColumns}&${queryOrder}&${queryPage}&${querySearch}&${queryFilter}`
  return {
    ...queryPage,
    ...queryColumns,
    ...querySearch,
    ...queryOrder,
    ...queryFilter,
  }
}
