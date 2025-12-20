<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import type { DataTableEmits, DataTableProps, DataTableSlots, RowItem } from '../types'
import { useColumnRegistry } from './columns'
import ColumnObserver from './columns/ColumnObserver'
import { useController } from './controller'
import { useCore } from './core'
import { useDataProvider } from './data'
import { useDataSynchronization } from './data/useDataSynchronization'
import Root from './layout/Root.vue'
import { provideMessages } from './localization/use-messages'
import { usePluginConfiguration } from './plugin/configuration'
import { Source } from './types'

const props = withDefaults(defineProps<DataTableProps>(), {
  url: undefined,
  source: Source.REMOTE,
  items: () => [],
  filter: () => ({}),
  requestAdapter: undefined,
  responseAdapter: undefined,
  pagination: true,
  page: undefined,
  defaultPage: 1,
  rowsPerPageCount: undefined,
  defaultRowsPerPageCount: 25,
  rowsPerPageOptions: () => [10, 25, 50, 100],
  showPageDetails: true,
  search: true,
  searchQuery: undefined,
  defaultSearchQuery: '',
  sort: undefined,
  defaultSort: null,
  selectedRowKeys: undefined,
  defaultSelectedRowKeys: () => [],
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
  density: 'comfortable',
})

const emit = defineEmits<DataTableEmits>()

defineSlots<DataTableSlots>()

const pluginConf = usePluginConfiguration()

provideMessages(() => props.messages)

const columnRegistry = useColumnRegistry<RowItem>()

const core = useCore({
  columnRegistry,
  props,
  emit,
})

const dataProvider = useDataProvider({
  getSource: () => props.source,
  columnRegistry,
  core,
  getLocalItems: () => props.items,
  getFilter: () => props.filter,
  getUrl: () => props.url,
  getRequestAdapter: () => props.requestAdapter ?? pluginConf.requestAdapter,
  getResponseAdapter: () => props.responseAdapter ?? pluginConf.responseAdapter,
  getCsrfToken: () => pluginConf.csrfToken,
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
  },
  emit,
})

const initializeLocal = () => {
  if (props.source !== Source.LOCAL) {
    return
  }

  core.normalize(true)
  dataProvider.apply()
}

useDataSynchronization(props, core, columnRegistry, dataProvider)

let active = true

onBeforeUnmount(() => {
  active = false
})

defineExpose({
  reload: dataProvider.reload,
  clearSelection: () => {
    if (active) {
      core.clearSelection()
    }
  },
})
</script>

<template>
  <div
    class="dt182"
    :data-density="density"
  >
    <column-observer
      :registry="columnRegistry"
      :table-props="props"
      @ready="initializeLocal"
    >
      <slot></slot>
    </column-observer>
    <root :controller="controller">
      <template
        v-if="$slots.loading"
        #loading
        ><slot name="loading"></slot
      ></template>
      <template
        v-if="$slots.empty"
        #empty
        ><slot name="empty"></slot
      ></template>
      <template
        v-if="$slots.noResults"
        #noResults
        ><slot name="noResults"></slot
      ></template>
      <template
        v-if="$slots.error"
        #error="scope"
        ><slot
          v-bind="scope"
          name="error"
        ></slot
      ></template>
      <template
        v-if="$slots.topLeftBeforeActions"
        #topLeftBeforeActions="scope"
      >
        <slot
          v-bind="scope"
          name="topLeftBeforeActions"
        ></slot>
      </template>

      <template
        v-if="$slots.topLeftAfterActions"
        #topLeftAfterActions="scope"
      >
        <slot
          v-bind="scope"
          name="topLeftAfterActions"
        ></slot>
      </template>

      <template
        v-if="$slots.topRight"
        #topRight="scope"
      >
        <slot
          v-bind="scope"
          name="topRight"
        ></slot>
      </template>
      <template
        v-if="$slots.search"
        #search="scope"
      >
        <slot
          v-bind="scope"
          name="search"
        />
      </template>
      <template
        v-if="$slots.pagination"
        #pagination="scope"
      >
        <slot
          v-bind="scope"
          name="pagination"
        />
      </template>
      <template
        v-if="$slots.rowsPerPage"
        #rowsPerPage="scope"
      >
        <slot
          v-bind="scope"
          name="rowsPerPage"
        />
      </template>
    </root>
  </div>
</template>
