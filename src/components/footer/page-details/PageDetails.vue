<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  filtered: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
  countItems: {
    type: Number,
    required: true,
  },
})

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
  <div class="data-table-page-details">
    <span>
      Записи с {{ numberStart }} до {{ numberEnd }} из {{ props.filtered }}
      {{ filteredRecords }}</span
    >
    <span v-if="props.total !== props.filtered"> (из {{ props.total }} {{ totalRecords }}) </span>
  </div>
</template>

<style scoped lang="scss">
.data-table-page-details {
  font-size: 13px;
  line-height: 1;
  color: #989898;
}
</style>
