<script setup lang="ts">
import { PropType, computed } from 'vue'
import { DTColumn, DTOrder, DTOrderDirection, DTTextAlign } from '@/types'
import orderAscIcon from '@/assets/order-asc.svg'
import orderDefaultIcon from '@/assets/order-default.svg'
import orderDescIcon from '@/assets/order-desc.svg'

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
  ...props.column.params.classObject,
}))

const orderIcon = computed(() => {
  if (!props.order || props.order.column !== props.column.params.field) {
    return orderDefaultIcon
  }

  return props.order.direction === DTOrderDirection.ASC ? orderAscIcon : orderDescIcon
})

const columnStyleObject = computed(() => {
  const value: {
    width?: string
    minWidth?: string
    maxWidth?: string
    textAlign: DTTextAlign
  } = {
    textAlign: DTTextAlign.LEFT,
  }

  if (props.column.params.width) {
    value.width = props.column.params.width
    value.minWidth = props.column.params.width
    value.maxWidth = props.column.params.width
  }

  if (props.column.params.textAlign) {
    value.textAlign = props.column.params.textAlign
  }

  return value
})

const handleOrderUpdate = () => {
  if (!columnOrderEnable.value) {
    return
  }

  let direction: DTOrderDirection

  if (
    !props.order ||
    props.order.column !== props.column.params.field ||
    props.order.direction === DTOrderDirection.DESC
  ) {
    direction = DTOrderDirection.ASC
  } else {
    direction = DTOrderDirection.DESC
  }

  const newOrderValue: DTOrder = {
    direction,
    column: props.column.params.field,
  }

  emit('update:order', newOrderValue)
}
</script>

<template>
  <div
    class="dt182-column"
    :class="classObject"
    :style="columnStyleObject"
    @click="handleOrderUpdate"
  >
    <div class="dt182-column-content">
      <span class="dt182-column-title">{{ props.column.params.title }}</span>
      <div
        v-if="columnOrderEnable"
        class="dt182-order-column-btn"
        v-html="orderIcon"
      />
    </div>
  </div>
</template>
