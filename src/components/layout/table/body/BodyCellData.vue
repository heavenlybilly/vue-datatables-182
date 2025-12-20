<script setup lang="ts">
import { computed } from 'vue'
import type { RowItem } from '../../../../types'
import { formatColumnValue, resolveColumnValue } from '../../../columns/column-value'
import type { ColumnDef } from '../../../columns/types'

const props = defineProps<{
  column: ColumnDef<RowItem>
  item: RowItem
}>()
const text = computed(() => formatColumnValue(resolveColumnValue(props.column, props.item)))
</script>

<template>
  <div :title="column.textOverflow === 'ellipsis' ? text : undefined">{{ text }}</div>
</template>
