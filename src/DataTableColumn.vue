<script setup lang="ts">
import { DTColumnProps, DTRow, DTTextAlign } from '@/types'
import { PropType } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props: DTColumnProps = defineProps({
  field: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: null,
  },
  orderable: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    required: false,
    default: undefined,
  },
  textAlign: {
    type: String as PropType<DTTextAlign>,
    default: undefined,
  },
})

const plug: DTRow = {
  index: 1,
  number: 1,
  item: {},
}
</script>

<template>
  <!-- eslint-disable-next-line -->
  <div v-if="false">
    <slot
      name="cell"
      :row="plug"
    ></slot>
  </div>
</template>
