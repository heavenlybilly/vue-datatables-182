<script setup lang="ts">
import { onMounted, onUpdated, useSlots } from 'vue'
import { useColumnRegistry } from './columns'
import { useCore } from './core'
import { useDataProvider } from './data'
import { useInteractor } from './interactor'
import Root from './layout/Root.vue'
import { getPluginConf } from './plugin'
import {
  OrderDirection,
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
  Source,
  TableFilter,
} from './types'

export type TableProps = {
  // Core props
  rowKey: RowKeySelector<RowItem>
  source?: Source

  // Data props
  url?: string
  filter?: TableFilter
  items?: RowItem[]
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter

  // Pagination props
  pagination?: boolean
  rowsPerPageCount?: number
  rowsPerPageOptions?: number[]
  showPageDetails?: boolean

  // Search props
  search?: boolean

  // Order props
  orderBy?: string
  orderDirection?: OrderDirection

  // Row selection props
  selection?: boolean
  selectionLimit?: number
  allowSelectAll?: boolean

  // Click rows props
  rowsClickable?: boolean
  selectOnRowClick?: boolean

  // Scroll options
  scrollX?: boolean
  stickyHeader?: boolean

  // Appearance props
  verticalBorders?: boolean
  striped?: boolean

  // Other props
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
  orderBy: undefined,
  orderDirection: undefined,
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
  (e: 'update:page', page: number): void
  (e: 'update:rowsPerPageCount', perPage: number): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:selectedRowKeys', keys: RowKey[]): void
  (e: 'selectionChange', payload: SelectedKeysChangePayload): void
  (e: 'rowClick', payload: RowClickPayload): void

  // request events
  (e: 'requestStart', payload: RequestStartPayload): void
  (e: 'requestEnd', payload: RequestEndPayload): void
  (e: 'requestError', payload: RequestErrorPayload): void
  (e: 'requestSuccess', payload: RequestSuccessPayload): void
}>()

const slots = useSlots()

const columnRegistry = useColumnRegistry<RowItem>()

const core = useCore({
  columnRegistry,
  getRowKey: () => props.rowKey,
  getPagination: () => props.pagination,
  getRowsPerPageCount: () => props.rowsPerPageCount,
  getRowsPerPageOptions: () => props.rowsPerPageOptions ?? [],
  getSearch: () => props.search,
  getOrderBy: () => props.orderBy ?? null,
  getOrderDirection: () => props.orderDirection ?? null,
  getSelection: () => props.selection,
  getSelectionLimit: () => props.selectionLimit,
  getAllowSelectAll: () => props.allowSelectAll,
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

const interactor = useInteractor({
  columnRegistry,
  core,
  data: dataProvider,
  props: {
    getRowsClickable: () => props.rowsClickable,
    getSelectOnRowClick: () => props.selectOnRowClick,
    getSelectionEnabled: () => props.selection,
    getAllowSelectAll: () => props.allowSelectAll,
    getRowKey: () => props.rowKey,
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
    <root
      :column-registry="columnRegistry"
      :core="core"
      :interactor="interactor"
      :search-enabled="props.search"
      :show-page-details="props.showPageDetails"
    >
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions"></slot>
      </template>

      <template #topLeftAfterActions>
        <slot name="topLeftAfterActions"></slot>
      </template>

      <template #topRight>
        <slot name="topRight"></slot>
      </template>
    </root>

    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
