<script setup lang="ts">
import { computed } from 'vue'
import sortAscIcon from '@/assets/sort-asc.svg'
import sortDefaultIcon from '@/assets/sort-default.svg'
import sortDescIcon from '@/assets/sort-desc.svg'
import { ColumnDef } from '../../../columns/types'
import { RowItem, SortDirection, TextAlign } from '../../../types'

const props = defineProps<{
  column: ColumnDef<RowItem>
  sortIndicator: SortDirection | null
}>()

const emit = defineEmits<{
  (e: 'click', column: ColumnDef<RowItem>): void
}>()

const styleObject = computed(() => {
  const value: Record<string, string> = {
    textAlign: props.column.textAlign ?? TextAlign.LEFT,
  }

  return value
})

const classValue = computed(() => {
  let value = ''

  if (props.column.sortable) {
    value += 'dt182-column-sortable'
  }

  return value
})

const sortIcon = computed(() => {
  if (!props.sortIndicator) {
    return sortDefaultIcon
  }

  return props.sortIndicator === SortDirection.ASC ? sortAscIcon : sortDescIcon
})

const onClick = () => {
  emit('click', props.column)
}
</script>

<template>
  <div
    class="dt182-column"
    :class="classValue"
    :style="styleObject"
    @click="onClick"
  >
    <div class="dt182-column-content">
      <span class="dt182-column-title">
        {{ props.column.title }}
      </span>
      <div
        v-if="props.column.sortable"
        class="dt182-sort-column-btn"
        v-html="sortIcon"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-sort-column-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.9rem;
  height: 1.1rem;
  margin-left: 0.2rem;

  svg {
    width: 0.6rem;
    height: 0.6rem;
  }
}

.dt182-column {
  padding: 1.2rem 1rem;
  overflow: hidden;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.3;
  vertical-align: middle;
  background-color: vars.$dt182-head-bg-color;
  transition: all vars.$transition-duration ease-in-out;
  user-select: none;

  &-content {
    display: inline-flex;
    align-items: center;
  }

  &-title {
    word-wrap: normal;
  }

  &.dt182-column-sortable:hover {
    background-color: vars.$dt182-head-hovered-cell-bg-color;
    cursor: pointer;
  }
}
</style>
