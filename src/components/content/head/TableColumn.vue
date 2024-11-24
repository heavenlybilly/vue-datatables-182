<script setup lang="ts">
import { PropType, computed } from 'vue'
import { DTColumn, DTOrder, DTOrderDirection } from '@/types/types'
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
  'dt-column-orderable': columnOrderEnable.value,
  ...props.column.appearance.classObject,
}))

const orderIcon = computed(() => {
  if (!props.order || props.order.column !== props.column.params.field) {
    return orderDefaultIcon
  }

  return props.order.direction === 'asc' ? orderAscIcon : orderDescIcon
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
    class="dt-column"
    :class="classObject"
    @click="handleOrderUpdate"
  >
    <div
      class="dt-column-inner"
      :style="props.column.appearance.styleObject"
    >
      <span>{{ props.column.params.title }}</span>
      <div
        v-if="columnOrderEnable"
        class="dt-order-column-btn"
        v-html="orderIcon"
      />
    </div>
  </th>
</template>
