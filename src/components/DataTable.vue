<script setup lang="ts">
import { computed, onMounted, onUpdated, useSlots } from 'vue'
import { useTableCore } from '@/components/core/useTableCore'
import { useColumnRegistry } from './columns'
import {
  Method,
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
} from './types'

export type DataTableProps = {
  // Core props
  rowKey: RowKeySelector<RowItem>
  source?: Source

  // Data props
  url?: string
  method?: Method
  items?: RowItem[]
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter

  // Pagination props
  pagination?: boolean
  rowsPerPageCount?: number
  rowsPerPageOptions?: number[]
  showRangeInfo?: boolean

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

const props = withDefaults(defineProps<DataTableProps>(), {
  url: undefined,
  source: Source.REMOTE,
  method: Method.post,
  items: () => [],
  requestAdapter: undefined,
  responseAdapter: undefined,
  pagination: true,
  rowsPerPageCount: 25,
  rowsPerPageOptions: () => [10, 25, 50, 100],
  showRangeInfo: true,
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

const coreConf = computed(() => ({
  rowKey: props.rowKey,
  pagination: props.pagination,
  rowsPerPageCount: props.rowsPerPageCount,
  rowsPerPageOptions: props.rowsPerPageOptions ?? [],
  search: props.search,
  orderBy: props.orderBy ?? null,
  orderDirection: props.orderDirection ?? null,
  selection: props.selection,
  selectionLimit: props.selectionLimit,
  allowSelectAll: props.allowSelectAll,
}))

const slots = useSlots()
const columnRegistry = useColumnRegistry<RowItem>()
const tableCore = useTableCore({ emit: emit as any, initialProps: coreConf.value })

const sync = () => {
  columnRegistry.rebuild({
    tableProps: props,
    slots: slots as unknown as Slots,
  })

  tableCore.normalize({
    columnRegistry,
    props: coreConf.value,
  })

  // if (props.source === Source.LOCAL) {
  //
  // } else {
  //
  // }
}

onMounted(() => {
  sync()
})

onUpdated(() => {
  sync()
})
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
