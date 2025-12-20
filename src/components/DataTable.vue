<script setup lang="ts">
import { onUpdated, useSlots } from 'vue'
import { DTSource } from '@/types'
import { useColumnRegistry } from './columns'
import { Slots } from './types'

export type DataTableProps = {
  /**
   * Core props
   */
  source?: DTSource
  numbering?: boolean
  selection?: boolean
  actions?: boolean
}

const props = defineProps<DataTableProps>()
const slots = useSlots()
const columnRegistry = useColumnRegistry()

columnRegistry.rebuild({
  tableProps: props,
  slots: slots as unknown as Slots,
})

onUpdated(() => {
  columnRegistry.rebuild({ tableProps: props, slots: slots as unknown as Slots })
})
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
