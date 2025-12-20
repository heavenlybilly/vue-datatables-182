import { computed, ref } from 'vue'
import type { RowItem } from '../types'
import { validateRowKeys } from './row-keys'
import { equalSort, positiveInteger } from './state-normalization'
import type { Core, CoreOptions, CoreState, TableData } from './types'
import { useQueryState } from './useQueryState'
import { useSelectionState } from './useSelectionState'

export const useCore = (options: CoreOptions): Core => {
  const { props } = options
  const tableData = ref<TableData>({
    items: [],
    total: 0,
    filtered: 0,
  })
  const hasData = ref(false)
  const isLoading = ref(false)
  const error = ref<unknown | null>(null)

  const getPageCount = (perPage: number) =>
    hasData.value ? Math.max(1, Math.ceil(tableData.value.filtered / perPage)) : Infinity

  const query = useQueryState(options, getPageCount)
  const pageCount = computed(() => getPageCount(query.perPage.value.value))
  const selection = useSelectionState(
    options,
    () => tableData.value,
    () => hasData.value,
    () => !isLoading.value && error.value === null,
  )
  let previousRowKey = props.rowKey
  let previousPagination = props.pagination !== false

  const querySnapshot = () => ({
    page: query.page.value.value,
    perPage: query.perPage.value.value,
    search: query.search.value.value,
    sort: query.sort.value.value,
  })

  const normalize = (deferData = false) => {
    const before = querySnapshot()

    if (!deferData && hasData.value && previousRowKey !== props.rowKey) {
      validateRowKeys(tableData.value.items, selection.selector.value)
    }

    query.sync(deferData)

    const after = querySnapshot()
    const clearSelection =
      before.page !== after.page ||
      before.perPage !== after.perPage ||
      before.search !== after.search ||
      !equalSort(before.sort, after.sort) ||
      previousRowKey !== props.rowKey ||
      previousPagination !== (props.pagination !== false)

    selection.sync(clearSelection, deferData)
    previousRowKey = props.rowKey
    previousPagination = props.pagination !== false
  }

  const setTableData = (value: Partial<TableData>) => {
    if ('items' in value) {
      if (value.items === undefined || value.items === null) {
        throw new Error('items must be an array')
      }

      validateRowKeys(value.items, selection.selector.value)
    }

    tableData.value = {
      ...tableData.value,
      ...value,
    }
    hasData.value = true

    const page = query.page.value.value

    query.clampPage()

    if (page !== query.page.value.value || 'items' in value) {
      selection.normalize(page !== query.page.value.value)
    }
  }

  const reset = () => {
    tableData.value = {
      items: [],
      total: 0,
      filtered: 0,
    }
    hasData.value = false
    error.value = null
    query.resetPage()
    selection.clear(true)
  }

  const transition = (change: () => boolean, resetPage = true) => {
    if (!change()) {
      return
    }

    if (resetPage) {
      query.resetPage()
    }

    selection.clear(true)
  }

  const setPage = (value: number) => {
    if (!query.paginationEnabled()) {
      return
    }

    transition(
      () => query.page.request(Math.min(positiveInteger(value, 1), pageCount.value)),
      false,
    )
  }

  const setRowsPerPageCount = (value: number) => {
    if (!query.paginationEnabled()) {
      return
    }

    transition(() =>
      query.perPage.request(Number.isFinite(value) && value >= 1 ? Math.floor(value) : 25),
    )
  }

  const setSearchQuery = (value: string) => {
    if (query.searchEnabled()) {
      transition(() => query.search.request(value))
    }
  }

  const setSort: Core['setSort'] = (by, direction) => {
    transition(() =>
      query.sort.request(
        by && direction
          ? {
              by,
              direction,
            }
          : null,
      ),
    )
  }

  const state = computed(
    (): CoreState => ({
      tableData: tableData.value,
      paginationEnabled: query.paginationEnabled(),
      rowsPerPageOptions: query.rowsPerPageOptions.value,
      rowsPerPageCount: query.perPage.value.value,
      page: query.page.value.value,
      searchEnabled: query.searchEnabled(),
      searchQuery: query.search.value.value,
      sort: {
        by: (query.sort.value.value?.by as CoreState['sort']['by']) ?? null,
        direction: query.sort.value.value?.direction ?? null,
      },
      rowKeySelector: selection.selector.value,
      selectionEnabled: props.selection ?? false,
      selectAllAllowed: props.allowSelectAll ?? true,
      selectionLimit: selection.limit.value,
      selectedRowKeys: [...selection.selected.value.value],
      isLoading: isLoading.value,
      error: error.value,
    }),
  )

  return {
    get state() {
      return state.value
    },
    get pageCount() {
      return Number.isFinite(pageCount.value) ? pageCount.value : 1
    },
    setTableData,
    setPage,
    correctPage: (value) => {
      query.page.constrain(positiveInteger(value, 1))
      selection.clear(true)
    },
    setRowsPerPageCount,
    setSearchQuery,
    setSort,
    clearSort: () => setSort(null, null),
    clearSelection: () => selection.clear(),
    toggleRowItemSelection: (item: RowItem) => selection.toggle(item),
    selectAllRows: selection.selectAll,
    setLoading: (value) => {
      isLoading.value = value
    },
    setError: (value) => {
      error.value = value
    },
    normalize,
    reconcileSelection: () => selection.normalize(),
    reset,
    resetQuery: () => {
      query.resetPage()
      selection.clear(true)
    },
  }
}
