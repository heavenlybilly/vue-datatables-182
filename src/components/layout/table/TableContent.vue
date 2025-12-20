<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { DataTableSlots, RowItem } from '../../../types'
import type { Controller } from '../../controller/types'
import { useMessages } from '../../localization/use-messages'
import TableRows from './TableRows.vue'
import type { GridLayout } from './build-grid-layout'

const messages = useMessages()

const props = defineProps<{
  controller: Controller
  layout: GridLayout<RowItem>
}>()

defineSlots<DataTableSlots>()

const slots = useSlots()
const state = computed(() => props.controller.state)

const content = () => {
  if (state.value.isLoading) {
    return slots.loading || !state.value.tableData.items.length ? 'loading' : 'rows'
  }

  if (state.value.error !== null) {
    return 'error'
  }

  if (state.value.tableData.items.length) {
    return 'rows'
  }

  return state.value.tableData.total > 0 && state.value.tableData.filtered === 0
    ? 'noResults'
    : 'empty'
}
</script>

<template>
  <table-rows
    v-if="content() === 'rows'"
    :controller="controller"
    :layout="layout"
  />
  <div
    v-else
    class="dt182-data-state"
    :class="`dt182-data-state--${content()}`"
    role="row"
  >
    <div
      :aria-colspan="layout.orderedColumns.length"
      role="cell"
    >
      <div :role="content() === 'error' ? 'alert' : 'status'">
        <slot
          v-if="content() === 'loading'"
          name="loading"
        >
          <span>{{ messages.loading }}</span>
        </slot>
        <slot
          v-else-if="content() === 'error'"
          :error="state.error"
          name="error"
          :retry="controller.handlers.reload"
        >
          <p>{{ messages.error }}</p>
          <button
            class="dt182-retry"
            type="button"
            @click="controller.handlers.reload()"
          >
            {{ messages.retry }}
          </button>
        </slot>
        <slot
          v-else-if="content() === 'noResults'"
          name="noResults"
        >
          <p>{{ messages.noResults }}</p>
          <button
            v-if="state.searchEnabled && state.searchQuery"
            class="dt182-clear-search"
            type="button"
            @click="controller.handlers.searchInput('')"
          >
            {{ messages.clearSearch }}
          </button>
        </slot>
        <slot
          v-else
          name="empty"
        >
          <span>{{ messages.empty }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dt182-data-state {
  position: sticky;
  left: 0;
  grid-column: 1 / -1;
  width: var(--dt182-viewport-width, 100%);
  padding: 2rem 1rem;
  color: var(--dt182-muted-color, #596579);
  text-align: center;
  overflow-wrap: anywhere;
  background-color: var(--dt182-background, #fff);
  border-radius: 0 0 var(--dt182-border-radius, 0.375rem) var(--dt182-border-radius, 0.375rem);

  .dt182-retry,
  .dt182-clear-search {
    min-height: var(--dt182-control-height, var(--dt182-density-control-height, 2.25rem));
    padding: 0 0.75rem;
    color: var(--dt182-text-color, #243041);
    font: inherit;
    background: var(--dt182-control-background, #fff);
    border: 1px solid var(--dt182-border-color, #dce2e9);
    border-radius: var(--dt182-border-radius, 0.375rem);
    cursor: pointer;
  }

  &--error {
    color: var(--dt182-error-color, #af3a3a);
    background-color: var(--dt182-error-background, #fffbfb);
  }
}
</style>
