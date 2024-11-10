<script setup lang="ts">
// @ts-ignore
import { DTColumn, DTOrder } from '@/types'
import { PropType, computed } from 'vue'
import orderDescIcon from '@/assets/order-asc.svg'
// @ts-ignore
import orderDefaultIcon from '@/assets/order-default.svg'
// @ts-ignore
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

const emits = defineEmits(['update:order'])

const columnOrderEnable = computed(() => {
  return props.column.params.orderable
})

const styleObject = computed(() => ({
  width: props.column.appearance.width ?? 'initial',
  minWidth: props.column.appearance.width ?? 'initial',
  maxWidth: props.column.appearance.width ?? 'initial',
}))

const classObject = computed(() => ({
  orderable: columnOrderEnable.value,
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

  let newOrderValue: DTOrder

  if (!props.order || props.order.column !== props.column.params.field) {
    newOrderValue = {
      column: props.column.params.field,
      direction: 'asc',
    }

    emits('update:order', newOrderValue)
    return
  }

  newOrderValue = {
    column: props.column.params.field,
    direction: 'desc',
  }

  if (props.order.direction === 'desc') {
    newOrderValue.direction = 'asc'
  }

  emits('update:order', newOrderValue)
}
</script>

<template>
  <th
    class="data-table-th"
    :class="classObject"
    :style="styleObject"
    @click="handleOrderUpdate"
  >
    <div class="data-table-th-inner">
      <span>{{ props.column.params.title }}</span>
      <div v-if="columnOrderEnable">
        <img
          alt=""
          class="data-table-th-order"
          :src="orderIcon"
        />
      </div>
    </div>
  </th>
</template>

<style scoped lang="scss">
.data-table-th {
  padding: 0.7rem 1rem;
  transition: all 200ms ease-in-out;
  user-select: none;

  &.orderable:hover {
    cursor: pointer;
    background-color: #f3f3f3;
  }
}

.data-table-th-inner > * {
  display: inline-block;
}

.data-table-th-order {
  margin-left: 0.2rem;
  width: 10px;
  height: 10px;
}
</style>
