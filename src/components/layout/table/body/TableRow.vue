<script setup lang="ts">
defineProps<{
  rowsClickable: boolean
  verticalBorders: boolean
  striped: boolean
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div
    class="dt182-row"
    :class="{
      'dt182-row-clickable': rowsClickable,
      'dt182-with-vertical-borders': verticalBorders,
      'dt182-row--striped': striped,
      'dt182-row--selected': selected,
    }"
    role="row"
    @click="emit('click')"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.dt182-row {
  display: contents;

  &--striped .dt182-cell {
    background: var(--dt182-row-striped-background, #f8fafc);
  }

  .dt182-cell-sticky {
    background: var(--dt182-sticky-background, var(--dt182-background, #fff));
  }

  &--striped .dt182-cell-sticky {
    background: var(--dt182-row-striped-background, #f8fafc);
  }

  &-clickable {
    cursor: pointer;
  }

  &:hover .dt182-cell,
  &:focus-within .dt182-cell {
    background: var(--dt182-row-hover-background, #edf3fc);
  }

  &--selected .dt182-cell {
    background: var(--dt182-row-selected-background, #e2ecfc);
  }

  &--selected:hover .dt182-cell,
  &--selected:focus-within .dt182-cell {
    background: var(--dt182-row-selected-hover-background, #d5e4fa);
  }

  &:not(:last-child) .dt182-cell {
    border-bottom: 1px solid var(--dt182-border-color, #dce2e9);
  }

  &:last-child .dt182-cell:first-child {
    border-bottom-left-radius: var(--dt182-border-radius, 0.375rem);
  }

  &:last-child .dt182-cell:last-child {
    border-bottom-right-radius: var(--dt182-border-radius, 0.375rem);
  }

  &.dt182-with-vertical-borders .dt182-cell:not(:first-child) {
    border-left: 1px solid var(--dt182-border-color, #dce2e9);
  }
}
</style>
