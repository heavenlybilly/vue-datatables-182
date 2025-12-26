<script setup lang="ts">
import Paginator from '@/components/layout/controls/Paginator.vue'
import RowsPerPageSelector from '@/components/layout/controls/RowsPerPageSelector.vue'
import { ColumnRegistry } from '../columns/types'
import { Core } from '../core/types'
import { Interactor } from '../interactor/types'
import Pagination from './containers/Pagination.vue'
import Toolbar from './containers/Toolbar.vue'
import Wrapper from './containers/Wrapper.vue'
import SearchField from './controls/SearchField.vue'
import PageDetails from './widgets/PageDetails.vue'

const props = defineProps<{
  core: Core
  columnRegistry: ColumnRegistry
  interactor: Interactor
  searchEnabled: boolean
  showPageDetails: boolean
}>()
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
          :value="props.core.state.searchQuery"
          @update:value="props.interactor.handlers.searchInput"
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
          :options="props.core.state.rowsPerPageOptions"
          :value="props.core.state.rowsPerPageCount"
          @update:value="props.interactor.handlers.rowsPerPageCountChange"
        />
        <page-details
          v-if="props.showPageDetails"
          :count-items="props.core.state.tableData.items.length"
          :filtered="props.core.state.tableData.filtered"
          :page="props.core.state.page"
          :rows-per-page="props.core.state.rowsPerPageCount"
          :total="props.core.state.tableData.total"
        />
      </template>
      <template #bottomRight>
        <paginator
          :items-count="props.core.state.tableData.filtered"
          :page="props.core.state.page"
          :rows-per-page="props.core.state.rowsPerPageCount"
          @update:page="props.interactor.handlers.pageChange"
        />
      </template>
    </pagination>
  </wrapper>
</template>

<style lang="scss"></style>
