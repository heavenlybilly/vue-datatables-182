<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { DTTextAlign } from '@/types/types'

export default defineComponent({
  name: 'DataTableColumn',
  props: {
    field: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
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
  },
})
</script>

<template>
  <!-- eslint-disable-next-line -->
  <div v-if="false">
    <slot name="cell" />
  </div>
</template>
