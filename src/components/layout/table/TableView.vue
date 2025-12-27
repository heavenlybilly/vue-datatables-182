<script setup lang="ts">
import { computed } from 'vue'
import { ColumnDef } from '../../columns/types'
import { Controller } from '../../controller/types'
import { RowItem } from '../../types'
import { buildGridLayout } from './build-grid-layout'
import TableHeader from './header/TableHeader.vue'

const props = defineProps<{
  controller: Controller
}>()

const gridLayout = computed(() => {
  return buildGridLayout(props.controller.columns, props.controller.appearance.isScrollXEnabled())
})

const onHeaderCellClick = (column: ColumnDef<RowItem>) => {
  props.controller.handlers.sortClick(column.key)
}
</script>

<template>
  <div>
    <table-header
      :grid-layout="gridLayout"
      :sort-indicators="controller.ui.sortIndicators.value"
      @cell-click="onHeaderCellClick"
    />

    <div
      v-for="item of props.controller.state.tableData.items"
      :key="props.controller.state.rowKeySelector(item)"
      :style="gridLayout.gridStyle"
    >
      <div
        v-for="column of props.controller.columns"
        :key="column.key"
      >
        {{ item[column.field] }}
      </div>
    </div>

    <slot name="actions"></slot>
  </div>
</template>

<style lang="scss"></style>
