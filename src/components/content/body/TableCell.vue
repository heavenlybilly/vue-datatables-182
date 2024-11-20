<script setup lang="ts">
import { PropType, computed } from 'vue'
import decodeString from '@/helpers/decodeString'
import { DTColumn, DTRow, DTTextAlign } from '@/types/types'
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

const cellStyleObject = computed(() => {
  const styleObject: {
    width?: string
    minWidth?: string
    maxWidth?: string
    textAlign?: DTTextAlign
  } = {}

  if (props.column.appearance.textAlign) {
    styleObject.textAlign = props.column.appearance.textAlign
  }

  if (props.column.appearance.width) {
    styleObject.width = props.column.appearance.width
    styleObject.minWidth = props.column.appearance.width
    styleObject.maxWidth = props.column.appearance.width
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
    :class="props.column.appearance.classObject"
    :style="cellStyleObject"
  >
    {{ value }}
  </td>
</template>

<style lang="scss"></style>
