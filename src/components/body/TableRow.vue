<script setup lang="ts">
import { PropType, Ref, computed, onMounted, ref } from 'vue'
import { DTColumn, DTRow } from '@/types'
import { stickElements } from '@/utils/stick-elements'
import TableCell from '@/components/body/TableCell.vue'
import TableCellActions from '@/components/body/TableCellActions.vue'
import TableCellNumbering from '@/components/body/TableCellNumbering.vue'
import TableCellSelection from '@/components/body/TableCellSelection.vue'

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
  selectOnRowClick: {
    type: Boolean,
    required: true,
  },
  verticalBorders: {
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
  'dt182-row-clickable': props.rowsClickable,
  'dt182-with-vertical-borders': props.verticalBorders,
}))

const switchSelection = () => {
  emit(isChecked.value ? 'deselect-row' : 'select-row', props.row.index)
}

const handleSelectionCheckboxClick = () => {
  switchSelection()
}

const handleClickRow = () => {
  if (props.rowsClickable) {
    emit('click', props.row)
  }

  if (props.selectOnRowClick) {
    switchSelection()
  }
}

const initFixedColumns = () => {
  if (!rowElement.value) {
    return
  }

  stickElements(rowElement.value, 'td', props.fixedColumnsStart)
  stickElements(rowElement.value, 'td', props.fixedColumnsEnd, true)
}

onMounted(() => {
  initFixedColumns()
})
</script>

<template>
  <tr
    :key="props.row.index"
    ref="rowElement"
    class="dt182-row"
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
      @click="handleSelectionCheckboxClick"
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
