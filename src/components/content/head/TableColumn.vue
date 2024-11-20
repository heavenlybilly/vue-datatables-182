<script setup lang="ts">
import { PropType, computed } from 'vue'
import { DTColumn, DTOrder, DTOrderDirection, DTTextAlign } from '@/types/types'
import orderDescIcon from '@/assets/order-asc.svg'
import orderDefaultIcon from '@/assets/order-default.svg'
import orderAscIcon from '@/assets/order-desc.svg'

const props = defineProps({
  column: {
    type: Object as PropType<DTColumn>,
    required: true,
  },
  order: {
    type: Object as PropType<DTOrder | null>,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:order'])

const columnOrderEnable = computed(() => {
  return props.column.params.orderable
})

const classObject = computed(() => ({
  'dt182-column-orderable': columnOrderEnable.value,
  ...props.column.appearance.classObject,
}))

const orderIcon = computed(() => {
  if (!props.order || props.order.column !== props.column.params.field) {
    return orderDefaultIcon
  }

  return props.order.direction === 'asc' ? orderAscIcon : orderDescIcon
})

const columnStyleObject = computed(() => {
  const value: {
    width?: string
    minWidth?: string
    maxWidth?: string
  } = {}

  if (props.column.appearance.width) {
    value.width = props.column.appearance.width
    value.minWidth = props.column.appearance.width
    value.maxWidth = props.column.appearance.width
  }

  return value
})

const columnInnerStyleObject = computed(() => {
  let textAlign: DTTextAlign = 'left'

  if (props.column.appearance.textAlign) {
    textAlign = props.column.appearance.textAlign
  }

  return {
    textAlign,
  }
})

const handleOrderUpdate = () => {
  if (!columnOrderEnable.value) {
    return
  }

  let direction: DTOrderDirection

  if (
    !props.order ||
    props.order.column !== props.column.params.field ||
    props.order.direction === 'desc'
  ) {
    direction = 'asc'
  } else {
    direction = 'desc'
  }

  const newOrderValue: DTOrder = {
    direction,
    column: props.column.params.field,
  }

  emit('update:order', newOrderValue)
}
</script>

<template>
  <th
    class="dt182-column"
    :class="classObject"
    :style="columnStyleObject"
    @click="handleOrderUpdate"
  >
    <div
      class="dt182-column-inner"
      :style="columnInnerStyleObject"
    >
      <span>{{ props.column.params.title }}</span>
      <div
        v-if="columnOrderEnable"
        class="dt182-order-column-btn"
        v-html="orderIcon"
      />
    </div>
  </th>
</template>
