<script setup lang="ts">
import { computed } from 'vue'
import type { RowItem } from '../../../types'
import { ColumnKind } from '../../columns/types'
import type { Controller } from '../../controller/types'
import { useMessages } from '../../localization/use-messages'
import BodyCellData from './body/BodyCellData.vue'
import BodyCellNumbering from './body/BodyCellNumbering.vue'
import BodyCellSelection from './body/BodyCellSelection.vue'
import BodyCellSlot from './body/BodyCellSlot.vue'
import BodyCellWrapper from './body/BodyCellWrapper.vue'
import TableBody from './body/TableBody.vue'
import TableRow from './body/TableRow.vue'
import type { GridLayout } from './build-grid-layout'
import { cellStyle } from './cell-style'
import { stickyEdge } from './sticky-edge'

const props = defineProps<{
  controller: Controller
  layout: GridLayout<RowItem>
}>()
const messages = useMessages()
const state = computed(() => props.controller.state)
const rows = computed(() => {
  const start = state.value.paginationEnabled
    ? (state.value.page - 1) * state.value.rowsPerPageCount
    : 0

  return state.value.tableData.items.map((item, index) => ({
    item,
    index,
    number: start + index + 1,
    key: state.value.rowKeySelector(item),
  }))
})
</script>

<template>
  <table-body>
    <table-row
      v-for="row of rows"
      :key="row.key"
      :rows-clickable="
        controller.appearance.isRowsClickable() && !state.isLoading && state.error === null
      "
      :selected="controller.ui.isRowSelected(row.item)"
      :striped="controller.appearance.isStripedEnabled() && row.index % 2 === 1"
      :vertical-borders="controller.appearance.isVerticalBordersEnabled()"
      @click="controller.handlers.rowClick(row.item)"
    >
      <body-cell-wrapper
        v-for="(column, columnIndex) of layout.orderedColumns"
        :key="column.key"
        :class="[
          column.className,
          {
            'dt182-cell-sticky': !!column.sticky,
            ...stickyEdge(column.key, layout),
            'dt182-cell-ellipsis': column.textOverflow === 'ellipsis',
          },
        ]"
        :loading="state.isLoading"
        :style="cellStyle(column, layout)"
      >
        <button
          v-if="columnIndex === 0 && controller.appearance.isRowsClickable()"
          class="dt182-row-action"
          :disabled="state.isLoading || state.error !== null"
          type="button"
          @click.stop="controller.handlers.rowClick(row.item)"
        >
          {{ messages.activateRow(row.number) }}
        </button>
        <template v-if="column.kind === ColumnKind.DATA">
          <body-cell-slot
            v-if="column.slots?.cell"
            :cell-slot="column.slots.cell"
            :scope="row"
          />
          <body-cell-data
            v-else
            :column="column"
            :item="row.item"
          />
        </template>
        <body-cell-numbering
          v-else-if="column.kind === ColumnKind.NUMBERING"
          :number="row.number"
        />
        <body-cell-selection
          v-else-if="column.kind === ColumnKind.SELECTION"
          :disabled="controller.ui.selectionDisabled.value"
          :number="row.number"
          :selected="controller.ui.isRowSelected(row.item)"
          @click="controller.handlers.toggleRowSelection(row.item)"
        />
      </body-cell-wrapper>
    </table-row>
  </table-body>
</template>
