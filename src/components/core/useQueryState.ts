import { computed } from 'vue'
import type { Sort } from '../../types'
import type { ColumnKey } from '../columns/types'
import { equalSort, normalizeSort, positiveInteger } from './state-normalization'
import type { CoreOptions } from './types'
import { useOwnedField } from './useOwnedField'

export const useQueryState = (options: CoreOptions, getPageCount: (perPage: number) => number) => {
  const { props, emit, columnRegistry } = options
  const page = useOwnedField({
    read: () => props.page,
    initial: props.defaultPage ?? 1,
    normalize: (value) => positiveInteger(value, 1),
    emit: (value) => emit('update:page', value),
  })
  const perPage = useOwnedField({
    read: () => props.rowsPerPageCount,
    initial: props.defaultRowsPerPageCount ?? 25,
    normalize: (value) => positiveInteger(value, 25),
    emit: (value) => emit('update:rowsPerPageCount', value),
  })
  const search = useOwnedField({
    read: () => props.searchQuery,
    initial: props.defaultSearchQuery ?? '',
    normalize: (value) => value ?? '',
    emit: (value) => emit('update:searchQuery', value),
  })
  const sort = useOwnedField<Sort>({
    read: () => props.sort,
    initial: props.defaultSort ?? null,
    normalize: normalizeSort,
    equal: equalSort,
    emit: (value) =>
      emit(
        'update:sort',
        value === null
          ? null
          : {
              ...value,
            },
      ),
  })

  const paginationEnabled = () => props.pagination !== false

  const searchEnabled = () => props.search !== false

  const rowsPerPageOptions = computed(() => {
    const valid = (props.rowsPerPageOptions ?? [10, 25, 50, 100])
      .filter((value) => Number.isFinite(value) && value >= 1)
      .map(Math.floor)

    return [...new Set([...valid, perPage.value.value])]
  })

  const signature = () => [perPage.value.value, search.value.value, sort.value.value] as const

  const clampPage = (upperBound = true) => {
    page.constrain(
      paginationEnabled()
        ? Math.min(page.value.value, upperBound ? getPageCount(perPage.value.value) : Infinity)
        : 1,
    )
  }

  const resetPage = () => page.constrain(1)

  const sync = (deferData = false) => {
    const before = signature()

    perPage.sync()
    search.sync()
    sort.sync()
    page.sync()

    if (!searchEnabled()) {
      search.constrain('')
    }

    const selectedSort = sort.value.value

    if (selectedSort && !columnRegistry.findColumnByKey(selectedSort.by as ColumnKey)?.sortable) {
      sort.constrain(null)
    }

    const after = signature()
    const changed =
      before[0] !== after[0] || before[1] !== after[1] || !equalSort(before[2], after[2])

    if (changed) {
      resetPage()
    }

    clampPage(!deferData)
  }

  return {
    page,
    perPage,
    search,
    sort,
    paginationEnabled,
    searchEnabled,
    rowsPerPageOptions,
    sync,
    resetPage,
    clampPage,
  }
}
