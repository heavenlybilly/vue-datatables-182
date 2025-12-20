import { useContext } from '@/composables/useContext'
import { ref } from 'vue'
import { DTFilter, DTMethod, DTOrderDirection, DTRowItem, DTSource } from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { BaseContext, contextKey } from './context-key'

export const useDataParams = () => {
  const { provideContext } = useContext(contextKey)

  const searchQuery = ref<string | null>(null)
  const rowsPerPage = ref<number>(10)
  const page = ref<number>(1)
  const order = ref<{ by: string; direction: DTOrderDirection } | null>(null)

  const setSearchQuery = (value: string | null) => {
    searchQuery.value = value
  }

  const setPage = (value: number) => {
    page.value = value
  }

  const setRowsPerPage = (value: number) => {
    rowsPerPage.value = value
  }

  const setOrderBy = (value: string | null) => {
    if (!value) {
      order.value = null
      return
    }

    order.value = {
      direction: order.value?.direction ?? DTOrderDirection.ASC,
      by: value,
    }
  }

  const setOrderDirection = (value: DTOrderDirection) => {
    if (!order.value) {
      return
    }

    order.value = {
      direction: value,
      by: order.value.by,
    }
  }

  const initDataParams = ({
    source,
    url,
    filters,
    items,
    method,
    rowsPerPageCount,
    orderBy,
    orderDirection,
  }: {
    source: DTSource
    url: string | null
    filters: DTFilter
    items: DTRowItem[]
    method: DTMethod
    rowsPerPageCount: number
    orderBy: string | null
    orderDirection: DTOrderDirection
  }) => {
    rowsPerPage.value = rowsPerPageCount

    if (orderBy) {
      order.value = {
        direction: orderDirection,
        by: orderBy,
      }
    }

    const base: BaseContext = {
      method,
      filters,
      page,
      searchQuery,
      rowsPerPage,
      order,
      setSearchQuery,
      setPage,
      setRowsPerPage,
      setOrderBy,
      setOrderDirection,
    }

    if (source === DTSource.REMOTE) {
      if (!url) {
        throw new VueDatatables182Error('url is required for remote data source')
      }

      provideContext({
        source,
        url,
        ...base,
      })

      return
    }

    provideContext({
      source,
      items,
      ...base,
    })
  }

  return { initDataParams }
}
