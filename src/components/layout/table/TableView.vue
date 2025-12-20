<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableSlots } from '../../../types'
import { ColumnKind } from '../../columns/types'
import type { Controller } from '../../controller/types'
import { useMessages } from '../../localization/use-messages'
import TableContent from './TableContent.vue'
import { buildGridLayout } from './build-grid-layout'
import { cellStyle } from './cell-style'
import HeaderCellData from './header/HeaderCellData.vue'
import HeaderCellNumbering from './header/HeaderCellNumbering.vue'
import HeaderCellSelection from './header/HeaderCellSelection.vue'
import TableHeader from './header/TableHeader.vue'
import { stickyEdge } from './sticky-edge'
import { useViewportWidth } from './use-viewport-width'

const props = defineProps<{
  controller: Controller
}>()

defineSlots<DataTableSlots>()

const messages = useMessages()
const layout = computed(() =>
  buildGridLayout(props.controller.columns, props.controller.appearance.isScrollXEnabled()),
)
const state = computed(() => props.controller.state)
const ui = computed(() => props.controller.ui)
const appearance = computed(() => props.controller.appearance)
const handlers = computed(() => props.controller.handlers)
const viewport = ref<HTMLElement | null>(null)
const viewportWidth = useViewportWidth(viewport)
</script>

<template>
  <div
    ref="viewport"
    :aria-label="appearance.isScrollXEnabled() ? messages.tableLabel : undefined"
    class="dt182-table-viewport"
    :class="{
      'dt182-table-viewport--scroll': appearance.isScrollXEnabled(),
    }"
    :role="appearance.isScrollXEnabled() ? 'region' : undefined"
    :style="{
      '--dt182-viewport-width': viewportWidth,
    }"
    :tabindex="appearance.isScrollXEnabled() ? 0 : undefined"
  >
    <span
      aria-live="polite"
      class="dt182-sr-only"
      role="status"
      >{{ state.isLoading ? messages.loading : '' }}</span
    >
    <div
      :aria-busy="state.isLoading"
      :aria-label="messages.tableLabel"
      class="dt182-table"
      :class="{
        'dt182-table--scroll': appearance.isScrollXEnabled(),
      }"
      role="table"
      :style="layout.gridStyle"
    >
      <table-header :vertical-borders="appearance.isVerticalBordersEnabled()">
        <template
          v-for="column of layout.orderedColumns"
          :key="column.key"
        >
          <header-cell-data
            v-if="column.kind === ColumnKind.DATA"
            :class="{
              'dt182-column-sticky': !!column.sticky,
              ...stickyEdge(column.key, layout),
            }"
            :column="column"
            :sort-indicator="ui.sortIndicators.value[column.key]"
            :style="cellStyle(column, layout, appearance.isStickyHeaderEnabled())"
            @click="handlers.sortClick(column.key)"
          />
          <header-cell-numbering
            v-else-if="column.kind === ColumnKind.NUMBERING"
            :class="{
              'dt182-column-sticky': !!column.sticky,
              ...stickyEdge(column.key, layout),
            }"
            :style="cellStyle(column, layout, appearance.isStickyHeaderEnabled())"
          />
          <header-cell-selection
            v-else-if="column.kind === ColumnKind.SELECTION"
            :all-visible-selected="ui.allVisibleSelected.value"
            :class="{
              'dt182-column-sticky': !!column.sticky,
              ...stickyEdge(column.key, layout),
            }"
            :disabled="ui.selectionDisabled.value || !state.tableData.items.length"
            :has-selection="ui.hasSelection.value"
            :select-all-allowed="state.selectAllAllowed"
            :style="cellStyle(column, layout, appearance.isStickyHeaderEnabled())"
            @click="handlers.selectAllRows()"
          />
        </template>
      </table-header>
      <table-content
        :controller="controller"
        :layout="layout"
      >
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
      </table-content>
    </div>
  </div>
</template>

<style lang="scss">
@use './table-view';
</style>
