<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, DataTableColumn } from '../src'

const items = ref([
  { id: 1, name: 'До обновления' },
  { id: 2, name: 'Вторая строка' },
])
function update() {
  items.value = [
    { id: 1, name: 'После обновления' },
    { id: 3, name: 'Новая строка' },
  ]
}
</script>

<template>
  <button
    type="button"
    @click="update"
  >
    Обновить данные
  </button>
  <DataTable
    :items="items"
    row-key="id"
    selection
    source="local"
  >
    <DataTableColumn
      field="name"
      searchable
      sortable
      title="Имя"
    />
  </DataTable>
</template>
