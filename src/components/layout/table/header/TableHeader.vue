<script setup lang="ts">
import Cell from '@/components/layout/table/header/Cell.vue'
import { ColumnDef, ColumnKey } from '../../../columns/types'
import { RowItem, SortDirection } from '../../../types'
import { GridLayout } from '../build-grid-layout'

const props = defineProps<{
  gridLayout: GridLayout<RowItem>
  sortIndicators: Record<ColumnKey, SortDirection | null>
}>()

const emit = defineEmits<{
  (e: 'cell-click', column: ColumnDef<RowItem>): void
}>()

const onCellClick = (column: ColumnDef<RowItem>) => {
  emit('cell-click', column)
}
</script>

<template>
  <div
    class="dt182-head"
    :style="props.gridLayout.gridStyle"
  >
    <cell
      v-for="column of props.gridLayout.orderedColumns"
      :key="column.key"
      :column="column"
      :sort-indicator="props.sortIndicators[column.key]"
      @click="onCellClick"
    />
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
