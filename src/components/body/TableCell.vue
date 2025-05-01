<script setup lang="ts">
import { PropType, computed } from 'vue'
import { DTColumn, DTRow, DTTextAlign } from '@/types/types'
import decodeString from '@/utils/decode-string'
import TableCellSlot from '@/components/body/TableCellSlot.vue'

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

const cellStyleObject = computed(() => {
  const styleObject: {
    width?: string
    minWidth?: string
    maxWidth?: string
    textAlign?: DTTextAlign
  } = {}

  if (props.column.params.textAlign) {
    styleObject.textAlign = props.column.params.textAlign
  }

  if (props.column.params.width) {
    styleObject.width = props.column.params.width
    styleObject.minWidth = props.column.params.width
    styleObject.maxWidth = props.column.params.width
  }

  return styleObject
})
</script>

<template>
  <table-cell-slot
    v-if="props.column.slots.cell"
    :row="props.row"
    :style-object="cellStyleObject"
    :template="props.column.slots.cell"
  />
  <td
    v-else
    :key="props.column.index"
    class="dt182-cell"
    :class="props.column.params.classObject"
    :style="cellStyleObject"
  >
    {{ value }}
  </td>
</template>

<style lang="scss"></style>
