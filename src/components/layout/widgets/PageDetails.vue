<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  filtered: number
  page: number
  rowsPerPage: number
  countItems: number
}>()

const numberStart = computed(() => {
  if (!props.countItems) {
    return 0
  }

  return (props.page - 1) * props.rowsPerPage + 1
})

const numberEnd = computed(() => {
  return (props.page - 1) * props.rowsPerPage + props.countItems
})

function declension(value: number, one: string, four: string, five: string) {
  const count = Math.abs(value) % 100
  const lastDigit = count % 10

  if (count > 10 && count < 20) {
    return five
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return four
  }
  if (lastDigit === 1) {
    return one
  }
  return five
}

const filteredRecords = computed(() => {
  return declension(props.filtered, 'записи', 'записей', 'записей')
})

const totalRecords = computed(() => {
  return declension(props.total, 'записи', 'записей', 'записей')
})
</script>

<template>
  <div class="dt182-page-details">
    <span>
      Записи с {{ numberStart }} до {{ numberEnd }} из {{ props.filtered }}
      {{ filteredRecords }}</span
    >
    <span v-if="props.total !== props.filtered"> (из {{ props.total }} {{ totalRecords }}) </span>
  </div>
</template>

<style lang="scss">
@use '../vars';

.dt182-page-details {
  color: vars.$dt182-page-details-color;
  font-size: 0.82rem;
  line-height: 1;
}
</style>
