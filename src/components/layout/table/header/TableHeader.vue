<script setup lang="ts">
import { GridLayoutStyle } from '../build-grid-layout'

const props = defineProps<{
  gridStyle: GridLayoutStyle
}>()
</script>

<template>
  <div
    class="dt182-head"
    :style="props.gridStyle"
  >
    <slot></slot>
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
