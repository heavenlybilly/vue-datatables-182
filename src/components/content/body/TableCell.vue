<script setup lang="ts">
import { DTColumn, DTRow } from '@/types'
import { PropType, computed } from 'vue'
import decodeString from '@/helpers/decodeString'
import TableCellSlot from '@/components/content/body/TableCellSlot.vue'

const props = defineProps({
  column: {
    type: Object as PropType<DTColumn>,
    required: true,
  },
  row: {
    type: Object as PropType<DTRow>,
    required: true,
  },
})

const value = computed(() => {
  const raw = props.row.item[props.column.params.field] ?? ''

  if (typeof raw === 'string') {
    return decodeString(raw)
  }

  return raw
})
</script>

<template>
  <table-cell-slot
    v-if="props.column.slots.cell"
    :row="props.row"
    :template="props.column.slots.cell"
  />
  <td
    v-else
    :key="props.column.index"
    class="data-table-td"
    :class="props.column.appearance.classObject"
  >
    {{ value }}
  </td>
</template>

<style scoped lang="scss">
.data-table-td {
  padding: 0.75rem 1rem;
}
</style>
