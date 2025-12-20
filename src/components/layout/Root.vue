<script setup lang="ts">
import { computed, useSlots } from 'vue'
import TableView from '@/components/layout/table/TableView.vue'
import type { DataTableSlots } from '../../types'
import { Controller } from '../controller/types'
import Pagination from './containers/Pagination.vue'
import Toolbar from './containers/Toolbar.vue'
import Wrapper from './containers/Wrapper.vue'
import Paginator from './controls/Paginator.vue'
import RowsPerPageSelector from './controls/RowsPerPageSelector.vue'
import SearchField from './controls/SearchField.vue'
import PageDetails from './widgets/PageDetails.vue'

const props = defineProps<{
  controller: Controller
}>()

defineSlots<DataTableSlots>()

const slots = useSlots()
const showToolbar = () =>
  props.controller.state.searchEnabled ||
  !!slots.topLeftBeforeActions ||
  !!slots.topLeftAfterActions ||
  !!slots.topRight
const toolbarScope = computed(() => ({
  selectedCount: props.controller.state.tableData.items.filter(props.controller.ui.isRowSelected)
    .length,
  loading: props.controller.state.isLoading,
  clearSelection: props.controller.handlers.clearRowSelection,
  reload: props.controller.handlers.reload,
}))

const state = computed(() => props.controller.state)
const appearance = computed(() => props.controller.appearance)
const handlers = computed(() => props.controller.handlers)
</script>

<template>
  <wrapper>
    <toolbar v-if="showToolbar()">
      <template #topLeftBeforeActions>
        <slot
          v-bind="toolbarScope"
          name="topLeftBeforeActions"
        ></slot>
      </template>
      <template #topSearch>
        <slot
          v-if="state.searchEnabled"
          name="search"
          :set-value="handlers.searchInput"
          :value="state.searchQuery"
        >
          <search-field
            :value="state.searchQuery"
            @update:value="handlers.searchInput"
          />
        </slot>
      </template>
      <template #topLeftAfterActions>
        <slot
          v-bind="toolbarScope"
          name="topLeftAfterActions"
        ></slot>
      </template>
      <template #topRight>
        <slot
          v-bind="toolbarScope"
          name="topRight"
        ></slot>
      </template>
    </toolbar>

    <table-view :controller="controller">
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
    </table-view>

    <pagination v-if="state.paginationEnabled || appearance.isShowPageDetailsEnabled()">
      <template #bottomLeft>
        <slot
          v-if="state.paginationEnabled"
          name="rowsPerPage"
          :options="state.rowsPerPageOptions"
          :set-value="handlers.rowsPerPageCountChange"
          :value="state.rowsPerPageCount"
        >
          <rows-per-page-selector
            :options="state.rowsPerPageOptions"
            :value="state.rowsPerPageCount"
            @update:value="handlers.rowsPerPageCountChange"
          />
        </slot>
        <page-details
          v-if="appearance.isShowPageDetailsEnabled()"
          :count-items="state.tableData.items.length"
          :filtered="state.tableData.filtered"
          :page="state.page"
          :pagination="state.paginationEnabled"
          :rows-per-page="state.rowsPerPageCount"
          :total="state.tableData.total"
        />
      </template>
      <template #bottomRight>
        <slot
          v-if="state.paginationEnabled"
          name="pagination"
          :page="state.page"
          :page-count="Math.ceil(state.tableData.filtered / state.rowsPerPageCount)"
          :set-page="handlers.pageChange"
        >
          <paginator
            :items-count="state.tableData.filtered"
            :page="state.page"
            :rows-per-page="state.rowsPerPageCount"
            @update:page="handlers.pageChange"
          />
        </slot>
      </template>
    </pagination>
  </wrapper>
</template>
