<script setup lang="ts">
defineProps<{
  verticalBorders: boolean
}>()
</script>

<template>
  <div
    class="dt182-head"
    :class="{
      'dt182-with-vertical-borders': verticalBorders,
    }"
    role="row"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.dt182-head {
  display: contents;

  > :first-child {
    border-top-left-radius: var(--dt182-border-radius, 0.375rem);
  }

  > :last-child {
    border-top-right-radius: var(--dt182-border-radius, 0.375rem);
  }

  &.dt182-with-vertical-borders > .dt182-column:not(:first-child) {
    border-left: 1px solid var(--dt182-border-color, #dce2e9);
  }
}
</style>
