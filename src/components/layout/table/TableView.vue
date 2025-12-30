<script setup lang="ts">
import { computed } from 'vue'
import BodyCellData from '@/components/layout/table/body/BodyCellData.vue'
import BodyCellNumbering from '@/components/layout/table/body/BodyCellNumbering.vue'
import BodyCellSelection from '@/components/layout/table/body/BodyCellSelection.vue'
import BodyCellSlot from '@/components/layout/table/body/BodyCellSlot.vue'
import BodyCellWrapper from '@/components/layout/table/body/BodyCellWrapper.vue'
import { ColumnKind } from '../../columns/types'
import { Controller } from '../../controller/types'
import TableBody from './body/TableBody.vue'
import TableRow from './body/TableRow.vue'
import { buildGridLayout } from './build-grid-layout'
import HeaderCellData from './header/HeaderCellData.vue'
import HeaderCellNumbering from './header/HeaderCellNumbering.vue'
import HeaderCellSelection from './header/HeaderCellSelection.vue'
import TableHeader from './header/TableHeader.vue'

const props = defineProps<{
  controller: Controller
}>()

const gridLayout = computed(() => {
  return buildGridLayout(props.controller.columns, props.controller.appearance.isScrollXEnabled())
})

const state = computed(() => {
  return props.controller.state
})

const ui = computed(() => {
  return props.controller.ui
})

const appearance = computed(() => {
  return props.controller.appearance
})

const handlers = computed(() => {
  return props.controller.handlers
})

const displayedRows = computed(() => {
  const startNumber = state.value.paginationEnabled
    ? (state.value.page - 1) * state.value.rowsPerPageCount + 1
    : 1

  return state.value.tableData.items.map((item, index) => {
    return {
      number: startNumber + index,
      item,
    }
  })
})
</script>

<template>
  <div>
    <table-header :grid-style="gridLayout.gridStyle">
      <template v-for="column of gridLayout.orderedColumns">
        <header-cell-data
          v-if="column.kind === ColumnKind.DATA"
          :key="column.key"
          :column="column"
          :sort-indicator="ui.sortIndicators.value[column.key]"
          @click="handlers.sortClick(column.key)"
        />
        <header-cell-numbering
          v-else-if="column.kind === ColumnKind.NUMBERING"
          :key="column.key"
        />
        <header-cell-selection
          v-else-if="column.kind === ColumnKind.SELECTION"
          :key="column.key"
          :all-visible-selected="ui.allVisibleSelected.value"
          :has-selection="ui.hasSelection.value"
          :loading="state.isLoading"
          :select-all-allowed="state.selectAllAllowed"
          @click="handlers.selectAllRows()"
        />
      </template>
    </table-header>

    <table-body>
      <table-row
        v-for="row of displayedRows"
        :key="state.rowKeySelector(row)"
        :grid-style="gridLayout.gridStyle"
        :rows-clickable="appearance.isRowsClickable()"
        :vertical-borders="appearance.isVerticalBordersEnabled()"
        @click="handlers.rowClick(row.item)"
      >
        <body-cell-wrapper
          v-for="column of props.controller.columns"
          :key="column.key"
          :loading="props.controller.state.isLoading"
        >
          <template v-if="column.kind === ColumnKind.DATA">
            <body-cell-slot
              v-if="!!column.slots?.cell"
              :cell-slot="column.slots.cell"
              :item="row.item"
            />
            <body-cell-data
              v-else
              :content="row.item[column.field]"
            />
          </template>
          <body-cell-numbering
            v-if="column.kind === ColumnKind.NUMBERING"
            :number="row.number"
          />
          <body-cell-selection
            v-if="column.kind === ColumnKind.SELECTION"
            :loading="props.controller.state.isLoading"
            :selected="ui.isRowSelected(row.item)"
            @click.stop="handlers.toggleRowSelection(row.item)"
          />
        </body-cell-wrapper>
      </table-row>
    </table-body>
  </div>
</template>

<style lang="scss"></style>
