import { ColumnKind } from '../columns'
import { OrderDirection } from '../types'
import { formatSearchString } from './helpers'
import { LocalAdapterOptions } from './types'

export const useLocalAdapter = (options: LocalAdapterOptions) => {
  const apply = () => {
    const { columnRegistry, core } = options

    let rowItems = options.getLocalItems() ?? []

    core.setTableData({
      total: rowItems.length,
    })

    const { searchQuery, searchEnabled, sort, page, rowsPerPageCount, paginationEnabled } =
      core.state

    // search
    if (searchQuery.trim() && searchEnabled) {
      const query = formatSearchString(searchQuery.trim())

      // find all data columns that are searchable and have field or value prop
      const searchableColumns = columnRegistry.columns.filter((column) => {
        return (
          column.kind === ColumnKind.DATA && column.searchable && (column.field || column.value)
        )
      })

      if (searchableColumns.length) {
        rowItems = rowItems.filter((rowItem) => {
          return searchableColumns.some((column) => {
            // extract value from rowItem
            const value = column.field ? rowItem[column.field] : column.value!(rowItem)
            return formatSearchString(value).includes(query)
          })
        })
      }
    }

    // local total after searching
    core.setTableData({
      filtered: rowItems.length,
    })

    // sort
    if (sort.by && sort.direction) {
      const orderDirection = sort.direction === OrderDirection.ASC ? 1 : -1

      const column = columnRegistry.findColumnByKey(sort.by)

      if (column?.orderable && (column.field || column.value)) {
        rowItems.sort((a, b) => {
          // extract value from rows items
          const av = column.field ? a[column.field] : column.value!(a)
          const bv = column.field ? b[column.field] : column.value!(b)

          if (av < bv) return -1 * orderDirection
          if (av > bv) return 1 * orderDirection
          return 0
        })
      }
    }

    // paginate
    if (paginationEnabled) {
      const start = (page - 1) * rowsPerPageCount
      const end = start + rowsPerPageCount
      rowItems = rowItems.slice(start, end)

      if (page > core.pageCount) {
        core.setPage(core.pageCount)
      }
    }

    core.setTableData({
      items: rowItems,
    })
  }

  return {
    apply,
  }
}
