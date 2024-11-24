<script setup lang="ts">
import { PropType, Ref, computed, nextTick, onMounted, ref } from 'vue'
import { stickElements } from '@/helpers/stickElements'
import { DTColumn, DTRow } from '@/types/types'
import TableCell from '@/components/content/body/TableCell.vue'
import TableCellActions from '@/components/content/body/TableCellActions.vue'
import TableCellNumbering from '@/components/content/body/TableCellNumbering.vue'
import TableCellSelection from '@/components/content/body/TableCellSelection.vue'

const props = defineProps({
  row: {
    type: Object as PropType<DTRow>,
    required: true,
  },
  columns: {
    type: Array as PropType<DTColumn[]>,
    required: true,
  },
  selectedRowIndexes: {
    type: Array as PropType<number[]>,
    required: true,
  },
  rowSelection: {
    type: Boolean,
    required: true,
  },
  actions: {
    type: Boolean,
    required: true,
  },
  numbering: {
    type: Boolean,
    required: true,
  },
  fixedColumnsStart: {
    type: Number,
    required: true,
  },
  fixedColumnsEnd: {
    type: Number,
    required: true,
  },
  rowsClickable: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['select-row', 'deselect-row', 'click'])

const rowElement: Ref<HTMLElement | null> = ref(null)

const isChecked = computed(() => {
  return props.selectedRowIndexes.includes(props.row.index)
})

const classObject = computed(() => ({
  'dt-row-clickable': props.rowsClickable,
}))

const handleSelectRow = (index: number) => {
  emit('select-row', index)
}

const handleDeselectRow = (index: number) => {
  emit('deselect-row', index)
}

const handleClickRow = () => {
  if (props.rowsClickable) {
    emit('click', props.row)
  }
}

const initFixedColumns = () => {
  nextTick(() => {
    if (!rowElement.value) {
      return
    }

    stickElements(rowElement.value, 'td', props.fixedColumnsStart)
    stickElements(rowElement.value, 'td', props.fixedColumnsEnd, true)
  })
}

onMounted(initFixedColumns)
</script>

<template>
  <tr
    :key="props.row.index"
    ref="rowElement"
    class="dt-row"
    :class="classObject"
    @click="handleClickRow"
  >
    <table-cell-numbering
      v-if="props.numbering"
      :number="props.row.number"
    />
    <table-cell-selection
      v-if="props.rowSelection"
      :checked="isChecked"
      :index="props.row.index"
      @deselect-row="handleDeselectRow"
      @select-row="handleSelectRow"
    />
    <table-cell
      v-for="column of props.columns"
      :key="`${row.index}${column.index}`"
      :column="column"
      :row="props.row"
    />
    <table-cell-actions v-if="props.actions">
      <slot name="actions" />
    </table-cell-actions>
  </tr>
</template>
