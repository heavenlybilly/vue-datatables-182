<script setup lang="ts">
import { Sticky, TextAlign } from './types'

export interface TableColumnProps {
  title?: string
  field?: string
  value?: (row: unknown) => unknown
  searchable?: boolean
  orderable?: boolean
  width?: string
  textAlign?: TextAlign
  sticky?: Sticky
}

defineProps<TableColumnProps>()
</script>

<template>
  <!-- eslint-disable-next-line -->
  <div v-if="false">
    <slot name="cell" />
  </div>
</template>
