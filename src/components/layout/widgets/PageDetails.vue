<script setup lang="ts">
import { computed } from 'vue'
import { useMessages } from '../../localization/use-messages'

const messages = useMessages()

const props = withDefaults(
  defineProps<{
    total: number
    filtered: number
    page: number
    rowsPerPage: number
    countItems: number
    pagination?: boolean
  }>(),
  {
    pagination: true,
  },
)

const numberStart = computed(() => {
  if (!props.countItems) {
    return 0
  }

  return props.pagination ? (props.page - 1) * props.rowsPerPage + 1 : 1
})

const numberEnd = computed(() => {
  return props.countItems ? numberStart.value + props.countItems - 1 : 0
})
</script>

<template>
  <div
    aria-atomic="true"
    class="dt182-page-details"
    role="status"
  >
    {{
      messages.pageDetails({
        start: numberStart,
        end: numberEnd,
        filtered: props.filtered,
        total: props.total,
      })
    }}
  </div>
</template>

<style lang="scss">
.dt182-page-details {
  color: var(--dt182-muted-color, #596579);
  font-size: inherit;
  line-height: 1.4;
}
</style>
