<script setup lang="ts">
import { computed } from 'vue'
import { ColumnRegistry } from '../columns/types'
import { Core } from '../core/types'
import { Interactor } from '../interactor/types'
import Pagination from './containers/Pagination.vue'
import Toolbar from './containers/Toolbar.vue'
import Wrapper from './containers/Wrapper.vue'
import Paginator from './controls/Paginator.vue'
import RowsPerPageSelector from './controls/RowsPerPageSelector.vue'
import SearchField from './controls/SearchField.vue'
import PageDetails from './widgets/PageDetails.vue'

const props = defineProps<{
  core: Core
  columnRegistry: ColumnRegistry
  interactor: Interactor
  searchEnabled: boolean
  showPageDetails: boolean
}>()

const state = computed(() => props.core.state)
const handlers = computed(() => props.interactor.handlers)
const columns = computed(() => props.columnRegistry.columns)
</script>

<template>
  <wrapper>
    <toolbar>
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions"></slot>
      </template>
      <template #topSearch>
        <search-field
          v-if="props.searchEnabled"
          :value="state.searchQuery"
          @update:value="handlers.searchInput"
        />
      </template>
      <template #topLeftAfterActions>
        <slot name="topLeftAfterActions"></slot>
      </template>
      <template #topRight>
        <slot name="topRight"></slot>
      </template>
    </toolbar>

    <div>view</div>

    <pagination>
      <template #bottomLeft>
        <rows-per-page-selector
          :options="state.rowsPerPageOptions"
          :value="state.rowsPerPageCount"
          @update:value="handlers.rowsPerPageCountChange"
        />
        <page-details
          v-if="props.showPageDetails"
          :count-items="state.tableData.items.length"
          :filtered="state.tableData.filtered"
          :page="state.page"
          :rows-per-page="state.rowsPerPageCount"
          :total="state.tableData.total"
        />
      </template>
      <template #bottomRight>
        <paginator
          :items-count="state.tableData.filtered"
          :page="state.page"
          :rows-per-page="state.rowsPerPageCount"
          @update:page="handlers.pageChange"
        />
      </template>
    </pagination>
  </wrapper>
</template>

<style lang="scss"></style>
