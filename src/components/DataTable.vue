<script setup lang="ts">
import { onMounted, onUpdated, useSlots } from 'vue'
import { useColumnRegistry } from './columns'
import { useController } from './controller'
import { useCore } from './core'
import { useDataProvider } from './data'
import Root from './layout/Root.vue'
import { getPluginConf } from './plugin'
import {
  RequestAdapter,
  RequestEndPayload,
  RequestErrorPayload,
  RequestStartPayload,
  RequestSuccessPayload,
  ResponseAdapter,
  RowClickPayload,
  RowItem,
  RowKey,
  RowKeySelector,
  SelectedKeysChangePayload,
  Slots,
  SortDirection,
  Source,
  TableFilter,
} from './types'

export type TableProps = {
  // data
  source?: Source
  url?: string
  filter?: TableFilter
  items?: RowItem[]
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter

  // pagination
  pagination?: boolean
  rowsPerPageCount?: number
  rowsPerPageOptions?: number[]

  // search
  search?: boolean

  // sort
  sortBy?: string
  sortDirection?: SortDirection

  // rows & selection & click
  rowKey: RowKeySelector<RowItem>
  selection?: boolean
  allowSelectAll?: boolean
  selectionLimit?: number

  // appearance
  rowsClickable?: boolean
  selectOnRowClick?: boolean
  showPageDetails?: boolean
  scrollX?: boolean
  stickyHeader?: boolean
  verticalBorders?: boolean
  striped?: boolean
  numbering?: boolean
  actions?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  url: undefined,
  source: Source.REMOTE,
  items: () => [],
  filter: () => ({}),
  requestAdapter: undefined,
  responseAdapter: undefined,
  pagination: true,
  rowsPerPageCount: 25,
  rowsPerPageOptions: () => [10, 25, 50, 100],
  showPageDetails: true,
  search: true,
  sortBy: undefined,
  sortDirection: undefined,
  selection: false,
  selectionLimit: 1000,
  allowSelectAll: true,
  rowsClickable: false,
  selectOnRowClick: false,
  scrollX: false,
  stickyHeader: false,
  verticalBorders: false,
  striped: false,
  numbering: false,
  actions: false,
})

const emit = defineEmits<{
  // core
  (e: 'update:page', page: number): void
  (e: 'update:rowsPerPageCount', perPage: number): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:selectedRowKeys', keys: RowKey[]): void
  (e: 'selectionChange', payload: SelectedKeysChangePayload): void

  // remote
  (e: 'requestStart', payload: RequestStartPayload): void
  (e: 'requestEnd', payload: RequestEndPayload): void
  (e: 'requestError', payload: RequestErrorPayload): void
  (e: 'requestSuccess', payload: RequestSuccessPayload): void

  // interactivity
  (e: 'rowClick', payload: RowClickPayload): void
}>()

const slots = useSlots()

const columnRegistry = useColumnRegistry<RowItem>()

const core = useCore({
  columnRegistry,
  props: {
    // pagination
    isPaginationEnabled: () => props.pagination,
    getRowsPerPageCount: () => props.rowsPerPageCount,
    getRowsPerPageOptions: () => props.rowsPerPageOptions ?? [],

    // search
    isSearchEnabled: () => props.search,

    // sort
    getSortBy: () => props.sortBy ?? null,
    getSortDirection: () => props.sortDirection ?? null,

    // rows & selection
    getRowKey: () => props.rowKey,
    isSelectionEnabled: () => props.selection,
    isSelectAllAllowed: () => props.allowSelectAll,
    getSelectionLimit: () => props.selectionLimit,
  },
  emit,
})

const dataProvider = useDataProvider({
  getSource: () => props.source,
  columnRegistry,
  core,
  getLocalItems: () => props.items,
  getFilter: () => props.filter,
  getUrl: () => props.url,
  getRequestAdapter: () => props.requestAdapter ?? getPluginConf().requestAdapter,
  getResponseAdapter: () => props.responseAdapter ?? getPluginConf().responseAdapter,
  getCsrfToken: () => getPluginConf().csrfToken,
  emit,
})

const controller = useController({
  columnRegistry,
  core,
  dataProvider,
  props: {
    isShowPageDetailsEnabled: () => props.showPageDetails,
    isSelectOnRowClickEnabled: () => props.selectOnRowClick,
    isRowsClickable: () => props.rowsClickable,
    isScrollXEnabled: () => props.scrollX,
    isStickyHeaderEnabled: () => props.stickyHeader,
    isVerticalBordersEnabled: () => props.verticalBorders,
    isStripedEnabled: () => props.striped,
    isNumberingEnabled: () => props.numbering,
    isActionsEnabled: () => props.actions,
  },
  emit,
})

const rebuildColumns = () => {
  columnRegistry.rebuild({
    tableProps: props,
    slots: slots as unknown as Slots,
  })
}

const syncData = () => {
  core.normalize()
  dataProvider.apply()
}

onMounted(() => {
  rebuildColumns()
  syncData()
})

onUpdated(() => {
  rebuildColumns()
  syncData()
})
</script>

<template>
  <div>
    <root :controller="controller">
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions"></slot>
      </template>

      <template #topLeftAfterActions>
        <slot name="topLeftAfterActions"></slot>
      </template>

      <template #topRight>
        <slot name="topRight"></slot>
      </template>

      <template #actions>
        <slot name="actions"></slot>
      </template>
    </root>

    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
