<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RowKey, Sort } from '../src'
import TableExample from './TableExample.vue'

const page = ref(1)
const searchQuery = ref('')
const selectedRowKeys = ref<readonly RowKey[]>([])
const sort = ref<Sort>(null)
const tableProps = computed(() => ({
  page: page.value,
  searchQuery: searchQuery.value,
  sort: sort.value,
  selectedRowKeys: selectedRowKeys.value,
  search: true,
  selection: true,
  'onUpdate:page': (value: number) => {
    page.value = value
  },
  'onUpdate:searchQuery': (value: string) => {
    searchQuery.value = value
  },
  'onUpdate:sort': (value: Sort) => {
    sort.value = value
  },
  'onUpdate:selectedRowKeys': (value: readonly RowKey[]) => {
    selectedRowKeys.value = value
  },
}))
</script>

<template>
  <p>
    Страница: {{ page }}; поиск: {{ searchQuery }}; сортировка: {{ sort }}; выбор:
    {{ selectedRowKeys }}
  </p>
  <TableExample :table-props="tableProps" />
</template>
