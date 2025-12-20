import { ColumnKind } from '../columns/types'
import { OrderDirection, RowItem } from '../types'
import { formatSearchString } from './helpers'
import { Adapter } from './types'

const useLocalAdapter: Adapter = ({ columnRegistry, tableCore }) => {
  const apply = (items: RowItem[]) => {
    let rowItems = items.slice()

    tableCore.setTableData({
      total: rowItems.length,
    })

    const { searchQuery, searchEnabled, sort, page, rowsPerPageCount, paginationEnabled } =
      tableCore.state

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
    tableCore.setTableData({
      filtered: rowItems.length,
    })

    // sort
    if (sort.by && sort.direction) {
      const orderDirection = sort.direction === OrderDirection.ASC ? 1 : -1

      const column = columnRegistry.columns.find((c) => {
        return c.key === sort.by
      })

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

      if (page > tableCore.pageCount) {
        tableCore.setPage(tableCore.pageCount)
      }
    }

    tableCore.setTableData({
      items: rowItems,
    })
  }

  return {
    apply,
  }
}

export default useLocalAdapter
