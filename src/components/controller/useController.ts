import { computed } from 'vue'
import { ColumnKey, ColumnKind } from '../columns/types'
import { RowItem, SortDirection } from '../types'
import { Controller, ControllerOptions } from './types'

export const useController = (options: ControllerOptions) => {
  const nextSort = (key: ColumnKey) => {
    const { by, direction } = options.core.state.sort

    if (by !== key) {
      return { by: key, direction: SortDirection.ASC }
    }

    if (direction === SortDirection.ASC) {
      return { by: key, direction: SortDirection.DESC }
    }

    return { by: null, direction: null }
  }

  /**
   * Handlers
   */
  const searchInput = (value: string) => {
    options.core.setSearchQuery(value)
    options.dataProvider.apply()
  }

  const sortClick = (key: ColumnKey) => {
    const column = options.columnRegistry.findColumnByKey(key, ColumnKind.DATA)

    if (!column || !column?.sortable) {
      return
    }

    const { by, direction } = nextSort(key)

    if (!by || !direction) {
      options.core.clearSort()
    } else {
      options.core.setSort(by, direction)
    }

    options.dataProvider.apply()
  }

  const pageChange = (page: number) => {
    options.core.setPage(page)
    options.dataProvider.apply()
  }

  const rowsPerPageCountChange = (rowsPerPage: number) => {
    options.core.setRowsPerPageCount(rowsPerPage)
    options.dataProvider.apply()
  }

  const reload = () => {
    return options.dataProvider.reload()
  }

  const rowClick = (item: RowItem) => {
    if (!options.props.isRowsClickable()) {
      return
    }

    const key = options.core.state.rowKeySelector(item)
    options.emit('rowClick', { item, key })

    if (options.props.isSelectOnRowClickEnabled()) {
      options.core.toggleRowItemSelection(item)
    }
  }

  const toggleRowSelection = (item: RowItem) => {
    options.core.toggleRowItemSelection(item)
  }

  const clearRowSelection = () => {
    options.core.clearSelection()
  }

  const selectAllRows = () => {
    options.core.selectAllRows()
  }

  /**
   * Ui
   */
  const sortIndicators = computed(() => {
    const result: Record<ColumnKey, SortDirection | null> = {}
    const { by, direction } = options.core.state.sort

    options.columnRegistry.columns.forEach((column) => {
      result[column.key] = column.key === by ? direction : null
    })

    return result
  })

  const canSelectAll = computed(() => {
    return options.core.state.selectionEnabled && options.core.state.selectAllAllowed
  })

  const interactor: Controller = {
    get state() {
      return options.core.state
    },
    get columns() {
      return options.columnRegistry.columns
    },
    appearance: options.props,
    handlers: {
      searchInput,
      sortClick,
      pageChange,
      rowsPerPageCountChange,
      reload,

      rowClick,
      clearRowSelection,
      selectAllRows,
      toggleRowSelection,
    },
    ui: {
      sortIndicators,
      canSelectAll,
    },
  }

  return interactor
}
