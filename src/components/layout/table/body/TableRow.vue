<script setup lang="ts">
import { computed } from 'vue'
import { GridLayoutStyle } from '../build-grid-layout'

const props = defineProps<{
  gridStyle: GridLayoutStyle
  rowsClickable: boolean
  verticalBorders: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const classObject = computed(() => ({
  'dt182-row-clickable': props.rowsClickable,
  'dt182-with-vertical-borders': props.verticalBorders,
}))

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div
    class="dt182-row"
    :class="classObject"
    :style="props.gridStyle"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  width: 100%;

  &-clickable {
    cursor: pointer;

    &:hover {
      .dt182-cell {
        background-color: vars.$dt182-hovered-row-cell-bg-color;
      }

      .dt182-cell.dt182-sticky-start,
      td.dt182-sticky-end {
        background-color: vars.$dt182-hovered-row-sticky-cell-bg-color;
      }
    }
  }

  &:not(:last-child) .dt182-cell {
    border-bottom: 1px solid vars.$dt182-cell-border-color;
  }

  &.dt182-with-vertical-borders {
    .dt182-cell:not(:first-child) {
      border-left: 1px solid vars.$dt182-cell-border-color;
    }

    .dt182-sticky-start + .dt182-cell:not(.dt182-sticky-start) {
      border-left-width: 0;
    }
  }
}
</style>
