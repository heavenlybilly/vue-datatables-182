<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { DTRow, DTTextAlign } from '@/types/types'

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
  data() {
    return {
      rowPlug: {
        index: 1,
        number: 1,
        item: {},
      } as DTRow,
    }
  },
})
</script>

<template>
  <!-- eslint-disable-next-line -->
  <div v-if="false">
    <slot
      name="cell"
      :row="rowPlug"
    ></slot>
  </div>
</template>
