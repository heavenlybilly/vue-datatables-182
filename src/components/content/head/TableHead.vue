<script setup lang="ts">
import { PropType, Ref, nextTick, onMounted, ref } from 'vue'
import { stickElements } from '@/helpers/stickElements'
import { DTColumn, DTOrder } from '@/types/types'
import TableColumn from '@/components/content/head/TableColumn.vue'
import TableColumnActions from '@/components/content/head/TableColumnActions.vue'
import TableColumnNumbering from '@/components/content/head/TableColumnNumbering.vue'
import TableColumnSelection from '@/components/content/head/TableColumnSelection.vue'

const props = defineProps({
  columns: {
    type: Array as PropType<DTColumn[]>,
    required: true,
  },
  order: {
    type: Object as PropType<DTOrder | null>,
    required: false,
    default: null,
  },
  isSelectedAll: {
    type: Boolean,
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
})

const emit = defineEmits(['update:order', 'select-all', 'deselect-all'])

const rowElement: Ref<HTMLElement | null> = ref(null)

const handleOrderUpdate = (value: DTOrder) => {
  emit('update:order', value)
}

const handleSelectAll = () => {
  emit('select-all')
}

const handleDeselectAll = () => {
  emit('deselect-all')
}

const initFixedColumns = () => {
  nextTick(() => {
    if (!rowElement.value) {
      return
    }

    stickElements(rowElement.value, 'th', props.fixedColumnsStart)
    stickElements(rowElement.value, 'th', props.fixedColumnsEnd, true)
  })
}

onMounted(initFixedColumns)
</script>

<template>
  <thead class="dt-head">
    <tr ref="rowElement">
      <table-column-numbering v-if="props.numbering" />
      <table-column-selection
        v-if="props.rowSelection"
        :is-selected-all="props.isSelectedAll"
        @deselect-all="handleDeselectAll"
        @select-all="handleSelectAll"
      />
      <table-column
        v-for="column of props.columns"
        :key="column.index"
        :column="column"
        :order="props.order"
        @update:order="handleOrderUpdate"
      />
      <table-column-actions v-if="props.actions" />
    </tr>
  </thead>
</template>
