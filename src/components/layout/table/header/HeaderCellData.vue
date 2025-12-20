<script setup lang="ts">
import { computed } from 'vue'
import sortAscIcon from '@/assets/sort-asc.svg'
import sortDefaultIcon from '@/assets/sort-default.svg'
import sortDescIcon from '@/assets/sort-desc.svg'
import { ColumnDef } from '../../../columns/types'
import { useMessages } from '../../../localization/use-messages'
import { RowItem, SortDirection } from '../../../types'

const messages = useMessages()

const props = defineProps<{
  column: ColumnDef<RowItem>
  sortIndicator: SortDirection | null
}>()

const emit = defineEmits<{
  (e: 'click', column: ColumnDef<RowItem>): void
}>()

const classValue = computed(() => {
  const value: string[] = []

  if (props.column.sortable) {
    value.push('dt182-column-sortable')
  }

  if (props.column.className) {
    value.push(props.column.className)
  }

  return value.join(' ')
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
    :aria-sort="
      column.sortable
        ? sortIndicator === SortDirection.ASC
          ? 'ascending'
          : sortIndicator === SortDirection.DESC
            ? 'descending'
            : 'none'
        : undefined
    "
    class="dt182-column"
    :class="classValue"
    role="columnheader"
  >
    <span
      class="dt182-column-title"
      :class="{
        'dt182-column-title--wrap': column.headerTextOverflow === 'wrap',
      }"
      :title="column.title"
    >
      <component
        :is="column.slots?.header"
        v-if="column.slots?.header"
        :title="column.title || ''"
      />
      <template v-else>{{ column.title }}</template>
    </span>
    <button
      v-if="column.sortable"
      :aria-label="messages.sort(column.title || column.field || column.key)"
      class="dt182-sort-column-btn"
      type="button"
      @click="onClick"
    >
      <span
        aria-hidden="true"
        v-html="sortIcon"
      />
    </button>
  </div>
</template>

<style lang="scss">
@use './header-cell-data';
</style>
