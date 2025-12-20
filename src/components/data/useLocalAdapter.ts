import type { RowItem } from '../../types'
import { resolveColumnValue } from '../columns/column-value'
import { ColumnKind } from '../columns/types'
import { validateRowKeys } from '../core/row-keys'
import { formatSearchString } from './helpers'
import { sortLocalRows } from './sort-local-rows'
import type { LocalAdapterOptions } from './types'

export const useLocalAdapter = (options: LocalAdapterOptions) => {
  const apply = () => {
    const { columnRegistry, core } = options
    const source = options.getLocalItems() ?? []

    validateRowKeys(source, core.state.rowKeySelector)

    let items: readonly RowItem[] = source
    const { searchQuery, searchEnabled, sort, page, rowsPerPageCount, paginationEnabled } =
      core.state

    if (searchEnabled && searchQuery.trim()) {
      const query = formatSearchString(searchQuery.trim())
      const columns = columnRegistry.columns.filter(
        (column) =>
          column.kind === ColumnKind.DATA &&
          column.searchable &&
          (column.field !== undefined || column.value),
      )

      if (columns.length) {
        items = items.filter((item) =>
          columns.some((column) =>
            formatSearchString(resolveColumnValue(column, item)).includes(query),
          ),
        )
      }
    }

    if (sort.by && sort.direction) {
      const column = columnRegistry.findColumnByKey(sort.by, ColumnKind.DATA)

      if (column?.sortable && (column.field !== undefined || column.value)) {
        items = sortLocalRows(source, items, column, sort.direction)
      }
    }

    const filtered = items.length

    if (paginationEnabled) {
      const actualPage = Math.min(page, Math.max(1, Math.ceil(filtered / rowsPerPageCount)))
      const start = (actualPage - 1) * rowsPerPageCount

      items = items.slice(start, start + rowsPerPageCount)
    }

    core.setTableData({
      total: source.length,
      filtered,
      items: [...items],
    })
  }

  return {
    apply,
  }
}
