import { computed } from 'vue'
import { ColumnKey, ColumnKind } from '../columns/types'
import { RowItem, SortDirection } from '../types'
import { Controller, ControllerOptions } from './types'

export const useController = (options: ControllerOptions) => {
  const nextSort = (key: ColumnKey) => {
    const { by, direction } = options.core.state.sort

    if (by !== key) {
      return {
        by: key,
        direction: SortDirection.ASC,
      }
    }

    if (direction === SortDirection.ASC) {
      return {
        by: key,
        direction: SortDirection.DESC,
      }
    }

    return {
      by: null,
      direction: null,
    }
  }

  const sortIndicators = computed(() => {
    const result: Record<ColumnKey, SortDirection | null> = {}
    const { by, direction } = options.core.state.sort

    options.columnRegistry.columns.forEach((column) => {
      result[column.key] = column.key === by ? direction : null
    })

    return result
  })

  const selectionDisabled = computed(() => {
    const { state } = options.core

    return (
      !state.selectionEnabled ||
      state.isLoading ||
      state.error !== null ||
      state.selectionLimit === 0
    )
  })

  const canSelectAll = computed(
    () =>
      !selectionDisabled.value &&
      options.core.state.selectAllAllowed &&
      options.core.state.tableData.items.length > 0,
  )

  const selectedKeysSet = computed(() => new Set(options.core.state.selectedRowKeys))

  const hasSelection = computed(() =>
    options.core.state.tableData.items.some((item) =>
      selectedKeysSet.value.has(options.core.state.rowKeySelector(item)),
    ),
  )

  const allVisibleSelected = computed(() => {
    const { items } = options.core.state.tableData

    return (
      items.length > 0 &&
      items.every((item) => selectedKeysSet.value.has(options.core.state.rowKeySelector(item)))
    )
  })

  const isRowSelected = (item: RowItem) => {
    return selectedKeysSet.value.has(options.core.state.rowKeySelector(item))
  }

  const searchInput = (value: string) => {
    options.core.setSearchQuery(value)
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
  }

  const pageChange = (page: number) => {
    options.core.setPage(page)
  }

  const rowsPerPageCountChange = (rowsPerPage: number) => {
    options.core.setRowsPerPageCount(rowsPerPage)
  }

  const reload = () => {
    return options.dataProvider.reload()
  }

  const rowClick = (item: RowItem) => {
    if (
      !options.props.isRowsClickable() ||
      options.core.state.isLoading ||
      options.core.state.error !== null
    ) {
      return
    }

    const key = options.core.state.rowKeySelector(item)

    options.emit('rowClick', {
      item,
      key,
    })

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
    if (!canSelectAll.value) {
      return
    }

    if (allVisibleSelected.value) {
      options.core.clearSelection()

      return
    }

    options.core.selectAllRows()
  }

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
      selectionDisabled,
      canSelectAll,
      hasSelection,
      allVisibleSelected,
      isRowSelected,
    },
  }

  return interactor
}
