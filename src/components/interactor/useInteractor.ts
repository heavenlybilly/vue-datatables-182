import { computed } from 'vue'
import { ColumnKey, ColumnKind } from '../columns/types'
import { OrderDirection, RowItem } from '../types'
import { Interactor, InteractorOptions } from './types'

export const useInteractor = (options: InteractorOptions) => {
  const nextSort = (key: ColumnKey) => {
    const { by, direction } = options.core.state.sort

    if (by !== key) {
      return { by: key, direction: OrderDirection.ASC }
    }

    if (direction === OrderDirection.ASC) {
      return { by: key, direction: OrderDirection.DESC }
    }

    return { by: null, direction: null }
  }

  /**
   * Handlers
   */
  const searchInput = (value: string) => {
    options.core.setSearchQuery(value)
    options.data.apply()
  }

  const sortClick = (key: ColumnKey) => {
    const column = options.columnRegistry.findColumnByKey(key, ColumnKind.DATA)

    if (!column || !column?.orderable) {
      return
    }

    const { by, direction } = nextSort(key)

    if (!by || !direction) {
      options.core.clearSort()
    } else {
      options.core.setSort(by, direction)
    }

    options.data.apply()
  }

  const pageChange = (page: number) => {
    options.core.setPage(page)
    options.data.apply()
  }

  const rowsPerPageCountChange = (rowsPerPage: number) => {
    options.core.setRowsPerPageCount(rowsPerPage)
    options.data.apply()
  }

  const reload = () => {
    return options.data.reload()
  }

  const rowClick = (item: RowItem) => {
    if (!options.props.getRowsClickable()) {
      return
    }

    const key = options.getRowKey(item)
    options.emit('rowClick', { item, key })

    if (options.props.getSelectOnRowClick() && options.props.getSelectionEnabled()) {
      options.core.toggleRowItemSelection(item)
    }
  }

  const toggleRowSelection = (item: RowItem) => {
    if (!options.props.getSelectionEnabled()) {
      return
    }

    options.core.toggleRowItemSelection(item)
  }

  const clearRowSelection = () => {
    options.core.clearSelection()
  }

  const selectAllRows = () => {
    if (!options.props.getAllowSelectAll() || !options.props.getSelectionEnabled()) {
      return
    }

    options.core.selectAllRows()
  }

  /**
   * Ui
   */
  const sortIndicators = computed(() => {
    const result: Record<ColumnKey, OrderDirection | null> = {}
    const { by, direction } = options.core.state.sort

    options.columnRegistry.columns.forEach((column) => {
      result[column.key] = column.key === by ? direction : null
    })

    return result
  })

  const canSelectAll = computed(() => {
    return options.props.getSelectionEnabled() && options.props.getAllowSelectAll()
  })

  const interactor: Interactor = {
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
