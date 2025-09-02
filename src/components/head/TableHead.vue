<script setup lang="ts">
import { PropType, Ref, computed, onUpdated, ref } from 'vue'
import { DTColumn, DTOrder } from '@/types'
import { stickElements } from '@/utils/stick-elements'
import TableColumn from '@/components/head/TableColumn.vue'
import TableColumnActions from '@/components/head/TableColumnActions.vue'
import TableColumnNumbering from '@/components/head/TableColumnNumbering.vue'
import TableColumnSelection from '@/components/head/TableColumnSelection.vue'

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
  verticalBorders: {
    type: Boolean,
    required: true,
  },
  stickyHeader: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:order', 'select-all', 'deselect-all'])

const isElementInitialized = ref(false)
const rowElement: Ref<HTMLElement | null> = ref(null)

const classObject = computed(() => ({
  'dt182-with-vertical-borders': props.verticalBorders,
  'dt182-head-sticky': props.stickyHeader,
}))

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
  if (!rowElement.value) {
    return
  }

  stickElements(rowElement.value, 'th', props.fixedColumnsStart)
  stickElements(rowElement.value, 'th', props.fixedColumnsEnd, true)
}

onUpdated(() => {
  if (!isElementInitialized.value) {
    initFixedColumns()
    isElementInitialized.value = true
  }
})
</script>

<template>
  <thead
    class="dt182-head"
    :class="classObject"
  >
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
