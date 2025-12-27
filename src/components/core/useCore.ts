import { computed, ref } from 'vue'
import { Logger } from '@/logger'
import { ColumnKey } from '../columns/types'
import { RowItem, RowKey, SortDirection } from '../types'
import { clampInt, makeRowKeySelector } from './helpers'
import { Core, CoreOptions, CoreState, SortState, TableData } from './types'

export const useCore = (options: CoreOptions) => {
  const { columnRegistry, emit, props } = options

  /**
   * Stable getters
   */
  // data
  const tableData = ref<TableData>({
    items: [],
    total: 0,
    filtered: 0,
  })

  // pagination
  const paginationEnabled = ref<boolean>(props.isPaginationEnabled())
  const rowsPerPageOptions = ref<number[]>(props.getRowsPerPageOptions())
  const rowsPerPageCount = ref(0)
  const page = ref(1)

  // search
  const searchEnabled = ref<boolean>(props.isSearchEnabled())
  const searchQuery = ref('')

  // sort
  const sort = ref<SortState>({
    by: null,
    direction: null,
  })

  // row selection
  const rowKeySelector = ref<(item: RowItem) => RowKey>(makeRowKeySelector(props.getRowKey()))
  const selectionEnabled = ref<boolean>(props.isSelectionEnabled())
  const selectAllAllowed = ref<boolean>(props.isSelectAllAllowed())
  const selectionLimit = ref<number | null>(props.getSelectionLimit())
  const selectedRowKeys = ref<RowKey[]>([])

  // status
  const isLoading = ref(false)
  const error = ref<unknown | null>(null)

  /**
   * Computed getters
   */
  const pageCount = computed(() => {
    const perPage = rowsPerPageCount.value

    if (perPage <= 0) {
      return 1
    }

    return Math.max(1, Math.ceil(tableData.value.total / perPage))
  })

  const rangeInfo = computed(() => {
    if (tableData.value.total === 0) {
      return { from: 0, to: 0, total: 0 }
    }

    const from = (page.value - 1) * rowsPerPageCount.value + 1
    const to = Math.min(tableData.value.total, page.value * rowsPerPageCount.value)

    return { from, to, total: tableData.value.total }
  })

  /**
   * Setters
   */
  // data
  const setTableData = (value: Partial<TableData>) => {
    tableData.value = {
      ...tableData.value,
      ...value,
    }
  }

  // pagination
  const setPage = (value: number) => {
    if (!paginationEnabled.value) {
      return
    }

    const newValue = clampInt(value, 1, pageCount.value)

    if (newValue !== page.value) {
      page.value = newValue
      emit('update:page', newValue)
    }
  }

  const setRowsPerPageCount = (value: number) => {
    if (!paginationEnabled.value) {
      return
    }

    const newValue = Math.max(1, value)

    if (newValue !== rowsPerPageCount.value) {
      rowsPerPageCount.value = newValue
      page.value = 1
      emit('update:rowsPerPageCount', newValue)
      emit('update:page', 1)
    }
  }

  // search
  const setSearchQuery = (value: string) => {
    if (!searchEnabled.value) {
      return
    }

    const newValue = value ?? ''

    if (newValue !== searchQuery.value) {
      searchQuery.value = newValue
      emit('update:searchQuery', newValue)

      if (paginationEnabled.value) {
        page.value = 1
        emit('update:page', 1)
      }
    }
  }

  // sort
  const setSort = (by: ColumnKey | null, direction: SortDirection | null) => {
    sort.value = { by, direction }

    if (paginationEnabled.value) {
      page.value = 1
      emit('update:page', 1)
    }
  }

  const clearSort = () => {
    setSort(null, null)
  }

  // selection
  const toggleRowItemSelection = (item: RowItem) => {
    if (!selectionEnabled.value) {
      return
    }

    const key = rowKeySelector.value(item)
    const index = selectedRowKeys.value.findIndex((x) => x === key)

    const next = selectedRowKeys.value.slice()

    if (index >= 0) {
      next.splice(index, 1)
    } else {
      if (selectionLimit.value && next.length >= selectionLimit.value) {
        return
      }

      next.push(key)
    }

    selectedRowKeys.value = next
    emit('update:selectedRowKeys', next)

    const set = new Set(next)
    const selectedItems = tableData.value.items.filter((i) => set.has(rowKeySelector.value(i)))

    emit('selectionChange', { keys: next, items: selectedItems })
  }

  const clearSelection = () => {
    if (!selectedRowKeys.value.length || !selectionEnabled.value) {
      return
    }

    selectedRowKeys.value = []
    emit('update:selectedRowKeys', [])
    emit('selectionChange', { keys: [], items: [] })
  }

  const selectAllRows = () => {
    if (!selectionEnabled.value || !selectAllAllowed.value) {
      return
    }

    let next = tableData.value.items.slice()

    if (selectionLimit.value && next.length > selectionLimit.value) {
      next = next.slice(0, selectionLimit.value)
    }

    selectedRowKeys.value = next.map((item) => rowKeySelector.value(item))
    emit('update:selectedRowKeys', selectedRowKeys.value)
    emit('selectionChange', { keys: selectedRowKeys.value, items: next })
  }

  /**
   * Status
   */
  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const setError = (value: unknown | null) => {
    error.value = value
  }

  /**
   * Normalize
   */
  const normalize: Core['normalize'] = () => {
    // pagination
    paginationEnabled.value = props.isPaginationEnabled()
    rowsPerPageOptions.value = props.getRowsPerPageOptions()

    if (!props.isPaginationEnabled()) {
      page.value = 1
    } else {
      const opts = props.getRowsPerPageOptions() ?? []
      const fallback = props.getRowsPerPageCount() ?? opts[0] ?? 25

      if (opts.length === 0) {
        Logger.warn(`prop 'rowsPerPageOptions' is an empty array`)
        rowsPerPageCount.value = Math.max(1, fallback)
      } else if (props.getRowsPerPageCount() > 0) {
        if (!opts.includes(props.getRowsPerPageCount())) {
          Logger.warn(`prop 'rowsPerPageCount' is not present in prop 'rowsPerPageOptions'`)
          rowsPerPageOptions.value.push(props.getRowsPerPageCount())
          rowsPerPageCount.value = props.getRowsPerPageCount()
        } else {
          rowsPerPageCount.value = props.getRowsPerPageCount()
        }
      } else {
        rowsPerPageCount.value = Math.max(1, opts[0] ?? 25)
      }

      page.value = clampInt(page.value, 1, pageCount.value)
    }

    // search
    searchEnabled.value = props.isSearchEnabled()

    if (!props.isSearchEnabled()) {
      searchQuery.value = ''
    }

    // sort
    const propSortBy = props.getSortBy()
    if (propSortBy) {
      const column = columnRegistry.findColumnByField(propSortBy)

      if (!column || !column.sortable) {
        clearSort()
      } else {
        sort.value = {
          by: column.key,
          direction: props.getSortDirection() ?? SortDirection.ASC,
        }
      }
    } else if (sort.value.by) {
      const column = columnRegistry.findColumnByKey(sort.value.by)

      if (!column || !column.sortable) {
        clearSort()
      }
    }

    // rows & selection & click
    rowKeySelector.value = makeRowKeySelector(props.getRowKey())
    selectionEnabled.value = props.isSelectionEnabled()
    selectionLimit.value = props.getSelectionLimit()
    selectAllAllowed.value = props.isSelectAllAllowed()

    const propSelectionLimit = props.getSelectionLimit()

    if (!props.isSelectionEnabled()) {
      clearSelection()
    } else if (propSelectionLimit && selectedRowKeys.value.length > propSelectionLimit) {
      selectedRowKeys.value = selectedRowKeys.value.slice(0, propSelectionLimit)
      emit('update:selectedRowKeys', selectedRowKeys.value)
    }

    page.value = clampInt(page.value, 1, pageCount.value)
  }

  const state = computed(
    (): CoreState => ({
      tableData: tableData.value,
      paginationEnabled: paginationEnabled.value,
      rowsPerPageOptions: rowsPerPageOptions.value,
      rowsPerPageCount: rowsPerPageCount.value,
      page: page.value,
      searchEnabled: searchEnabled.value,
      searchQuery: searchQuery.value,
      sort: sort.value,
      rowKeySelector: rowKeySelector.value,
      selectionEnabled: selectionEnabled.value,
      selectAllAllowed: selectAllAllowed.value,
      selectionLimit: selectionLimit.value,
      selectedRowKeys: selectedRowKeys.value,
      isLoading: isLoading.value,
      error: error.value,
    }),
  )

  const core: Core = {
    get state() {
      return state.value
    },

    // computed getters
    get pageCount() {
      return pageCount.value
    },
    get rangeInfo() {
      return rangeInfo.value
    },

    // setters
    setTableData,
    setPage,
    setRowsPerPageCount,
    setSearchQuery,
    setSort,
    clearSort,
    toggleRowItemSelection,
    clearSelection,
    selectAllRows,
    setLoading,
    setError,

    // normalize
    normalize,
  }

  return core
}
