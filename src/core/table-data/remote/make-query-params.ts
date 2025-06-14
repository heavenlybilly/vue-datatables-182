import { DTColumn, DTFilter, DTOrder } from '@/types'

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

const objectToQueryParams = (obj: Record<string, any> | null, parentKey: string = ''): string => {
  if (obj === null) {
    return ''
  }

  const queryParams: string[] = []

  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const fullKey = parentKey ? `${parentKey}[${key}]` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        queryParams.push(objectToQueryParams(value, fullKey))
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${fullKey}[${index}]`
          if (typeof item === 'object' && item !== null) {
            queryParams.push(objectToQueryParams(item, arrayKey))
          } else {
            queryParams.push(`${encodeURIComponent(arrayKey)}=${encodeURIComponent(item)}`)
          }
        })
      } else {
        queryParams.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`)
      }
    }
  })

  return queryParams.join('&')
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
  let queryFilter = ''
  if (params.filters) {
    queryFilter = objectToQueryParams(params.filters, 'filters')
  }

  return `${queryColumns}&${queryOrder}&${queryPage}&${querySearch}&${queryFilter}`
}
