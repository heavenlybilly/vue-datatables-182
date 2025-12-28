<script setup lang="ts">
import CellSelection from '@/components/layout/table/header/CellSelection.vue'
import { ColumnDef, ColumnKey, ColumnKind } from '../../../columns/types'
import { RowItem, SortDirection } from '../../../types'
import { GridLayout } from '../build-grid-layout'
import CellData from './CellData.vue'
import CellNumbering from './CellNumbering.vue'

const props = defineProps<{
  loading: boolean
  selectAllAllowed: boolean
  hasSelection: boolean
  allVisibleSelected: boolean
  gridLayout: GridLayout<RowItem>
  sortIndicators: Record<ColumnKey, SortDirection | null>
}>()

const emit = defineEmits<{
  (e: 'cell-click', column: ColumnDef<RowItem>): void
  (e: 'select-all-click'): void
}>()

const onCellClick = (column: ColumnDef<RowItem>) => {
  emit('cell-click', column)
}

const onSelectAllClick = () => {
  emit('select-all-click')
}
</script>

<template>
  <div
    class="dt182-head"
    :style="props.gridLayout.gridStyle"
  >
    <template v-for="column of props.gridLayout.orderedColumns">
      <cell-data
        v-if="column.kind === ColumnKind.DATA"
        :key="column.key"
        :column="column"
        :sort-indicator="props.sortIndicators[column.key]"
        @click="onCellClick"
      />
      <cell-numbering
        v-else-if="column.kind === ColumnKind.NUMBERING"
        :key="column.key"
      />
      <cell-selection
        v-else-if="column.kind === ColumnKind.SELECTION"
        :key="column.key"
        :all-visible-selected="props.allVisibleSelected"
        :has-selection="props.hasSelection"
        :loading="props.loading"
        :select-all-allowed="props.selectAllAllowed"
        @click="onSelectAllClick"
      />
    </template>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-head {
  overflow: hidden;
  background-color: vars.$dt182-head-bg-color;
  border-bottom: 1px solid vars.$dt182-head-border-bottom-color;
  border-radius: 5px;

  &.dt182-with-vertical-borders {
    .dt182-column:not(:first-child) {
      border-left: 1px solid vars.$dt182-head-cell-border-color;
    }

    .dt182-sticky-start + .dt182-column:not(.dt182-sticky-start) {
      border-left-width: 0;
    }
  }

  &.dt182-head-sticky {
    position: sticky;
    top: 0;
    z-index: 3;
  }
}
</style>
