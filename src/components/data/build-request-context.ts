import { ColumnKind } from '../columns/types'
import type { RequestContext } from '../types'
import { assertJsonValue, isPlainObject } from './json-value'
import type { RemoteAdapterOptions } from './types'

export const buildRequestContext = (options: RemoteAdapterOptions): RequestContext => {
  const url = options.getUrl()

  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('url must be a non-empty string')
  }

  const { state } = options.core
  const column = state.sort.by
    ? options.columnRegistry.findColumnByKey(state.sort.by, ColumnKind.DATA)
    : null
  const sortField = column?.sortField ?? column?.field

  if (column && (typeof sortField !== 'string' || !sortField.trim())) {
    throw new Error(`Column ${column.key}: remote sort requires sortField or field`)
  }

  const filter = options.getFilter()

  if (!isPlainObject(filter)) {
    throw new Error('filter must be a JSON-compatible object')
  }

  assertJsonValue(filter, 'filter')

  return {
    url,
    pagination: state.paginationEnabled,
    requestBody: {
      ...(state.paginationEnabled
        ? {
            page: state.page,
            perPage: state.rowsPerPageCount,
          }
        : {}),
      ...(state.searchEnabled && state.searchQuery.trim()
        ? {
            search: state.searchQuery.trim(),
          }
        : {}),
      ...(column
        ? {
            sortBy: sortField,
            sortDirection: state.sort.direction ?? undefined,
          }
        : {}),
      filter,
    },
  }
}
