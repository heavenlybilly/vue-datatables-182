import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DataTableProps } from '../../types'
import type { ColumnRegistry } from '../columns/types'
import type { Core } from '../core/types'
import { Source } from '../types'
import type { DataProvider } from './types'

export const useDataSynchronization = (
  props: DataTableProps,
  core: Core,
  registry: ColumnRegistry,
  provider: DataProvider,
) => {
  const revision = ref(0)
  const filterRevision = ref(0)

  onMounted(() => {
    core.normalize(props.source === Source.LOCAL)

    if (props.source !== Source.LOCAL) {
      provider.apply()
    }

    watch(
      () => [
        props.items,
        props.page,
        props.rowsPerPageCount,
        props.searchQuery,
        props.sort,
        props.selectedRowKeys,
        props.pagination,
        props.search,
        props.selection,
        props.selectionLimit,
        props.allowSelectAll,
        props.rowsPerPageOptions,
        props.rowKey,
        registry.columns,
      ],
      () => core.normalize(props.source === Source.LOCAL),
      {
        deep: true,
      },
    )
    watch(
      () => props.items,
      () => {
        if (props.source === Source.LOCAL) {
          revision.value += 1
        }
      },
      {
        deep: true,
      },
    )
    watch(
      () => props.filter,
      () => {
        if (props.source !== Source.REMOTE) {
          return
        }

        core.resetQuery()
        filterRevision.value += 1
      },
      {
        deep: true,
      },
    )
    watch(
      () => [props.source, props.url],
      () => {
        provider.cancel()
        core.reset()
        revision.value += 1
      },
    )
    watch(
      () => [props.requestAdapter, props.responseAdapter],
      () => {
        if (props.source !== Source.REMOTE) {
          return
        }

        provider.cancel()
        revision.value += 1
      },
    )

    const capture = () => {
      const { state } = core

      return {
        page: state.page,
        perPage: state.rowsPerPageCount,
        search: state.searchQuery,
        sortBy: state.sort.by,
        sortDirection: state.sort.direction,
        pagination: state.paginationEnabled,
        searchEnabled: state.searchEnabled,
        columns: registry.dataRevision,
        rowKey: props.source === Source.LOCAL ? props.rowKey : undefined,
        revision: revision.value,
        filterRevision: filterRevision.value,
      }
    }

    type ProcessingState = ReturnType<typeof capture>

    let applied = capture()

    watch(
      capture,
      (next) => {
        const changed = (keys: readonly (keyof ProcessingState)[]) =>
          keys.some((key) => next[key] !== applied[key])

        if (!changed(Object.keys(next) as (keyof ProcessingState)[])) {
          if (props.source === Source.LOCAL) {
            core.reconcileSelection()
          }

          return
        }

        const delayed =
          changed(['search', 'filterRevision']) &&
          !changed([
            'perPage',
            'sortBy',
            'sortDirection',
            'pagination',
            'searchEnabled',
            'columns',
            'rowKey',
            'revision',
          ])

        provider.apply(delayed)
        applied = capture()
      },
      {
        flush: 'post',
      },
    )
  })
  onBeforeUnmount(() => provider.dispose())
}
