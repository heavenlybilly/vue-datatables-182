import {
  DTColumn,
  DTFilter,
  DTMethod,
  DTOrder,
  DTRowItem,
  DTServerResponse,
  DTTableData,
} from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'
import makeQuery from './make-query'
import makeRequest from './make-request'
import objectToQueryParams from './object-to-query-params'

export const fetchRemoteItems = async (
  remoteConf: {
    url: string
    method: DTMethod
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
): Promise<DTTableData> => {
  const query = makeQuery({
    page: params.page,
    rowsPerPage: conf.pagination ? params.rowsPerPage : null,
    columns: conf.columns,
    search: params.search,
    order: params.order,
    filters: params.filters,
  })
  const queryParams = objectToQueryParams(query)

  let urlStr = remoteConf.url
  if (remoteConf.method === DTMethod.GET) {
    urlStr = `${remoteConf.url}?${queryParams}`
  }
  const queryBody = remoteConf.method === DTMethod.POST ? query : {}

  // todo: add post params
  const data = (await makeRequest(urlStr, remoteConf.method, queryBody)) as DTServerResponse

  if (data?.error) {
    throw new VueDatatables182Error(ErrorCategory.FETCHING_DATA, data.error)
  }

  let numberOffset = 0

  if (conf.pagination) {
    numberOffset = (params.page - 1) * params.rowsPerPage
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
