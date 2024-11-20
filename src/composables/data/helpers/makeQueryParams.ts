import { DTColumn, DTOrder } from '@/types/types'

const fromPageParams = (page: number, rowsPerPage: number | null) => {
  if (rowsPerPage) {
    return `start=${(page - 1) * rowsPerPage}&length=${rowsPerPage}`
  }

  return `start=1`
}

const fromSearch = (search: string | null) => {
  let querySearch = 'search[regex]=false'

  querySearch += '&search[value]='

  if (search) {
    querySearch += encodeURIComponent(search)
  }

  return querySearch
}

const fromOrder = (order: DTOrder | null, columns: DTColumn[]) => {
  if (!order) {
    return ''
  }

  const column = columns.find((item) => {
    return item.params.field === order.column
  })

  if (!column) {
    return ''
  }

  return `order[0][column]=${column.index}&order[0][dir]=${order.direction}`
}

// const fromFilter = (data: TDtFilterData) => {
//   let query = ''
//
//   for (const key in data) {
//     const value = data[key]
//
//     if (typeof value === 'string') {
//       query += `${key}[]=${encodeURIComponent(value)}&`
//     } else if (Array.isArray(value)) {
//       for (const item of value) {
//         query += `${key}[]=${encodeURIComponent(item)}&`
//       }
//     }
//   }
//
//   return query
// }

const fromColumns = (columns: DTColumn[]) => {
  return columns.reduce((carry, column) => {
    let fragment = ''

    fragment += `columns[${column.index}][data]=${column.params.field}`
    fragment += `&columns[${column.index}][name]=${column.params.field}`
    fragment += `&columns[${column.index}][searchable]=${true}`
    fragment += `&columns[${column.index}][orderable]=${column.params.orderable}`
    fragment += `&columns[${column.index}][searchable]=${column.params.searchable}`
    fragment += `&columns[${column.index}][search][value]=`
    fragment += `&columns[${column.index}][search][regex]=false`

    let newCarry = carry
    if (newCarry) {
      newCarry += '&'
    }

    newCarry += fragment

    return newCarry
  }, '')
}

export default (params: {
  page: number
  rowsPerPage: number | null
  columns: DTColumn[]
  search: string
  order: DTOrder | null
}) => {
  const queryPage = fromPageParams(params.page, params.rowsPerPage)
  const queryColumns = fromColumns(params.columns)
  const querySearch = fromSearch(params.search)
  const queryOrder = fromOrder(params.order, params.columns)
  const queryFilter = ''

  return `${queryColumns}&${queryOrder}&${queryPage}&${querySearch}&${queryFilter}`
}
