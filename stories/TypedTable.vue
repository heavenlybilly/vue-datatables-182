<script setup lang="ts">
import { ref } from 'vue'
import { type SelectionChangePayload, createTypedTable } from '../src'

type Item = { id: number; name: string }
const { DataTable, DataTableColumn } = createTypedTable<Item>()

const table = ref<InstanceType<typeof DataTable>>()
const items = [{ id: 1, name: 'Tarball consumer' }]
const selectedCount = ref(0)
function onSelection(payload: SelectionChangePayload<Item>) {
  selectedCount.value = payload.keys.length
}
function clear() {
  table.value?.clearSelection()
}
async function reload() {
  await table.value?.reload()
}
</script>

<template>
  <main>
    <button
      type="button"
      @click="clear"
    >
      Clear
    </button>
    <button
      type="button"
      @click="reload"
    >
      Reload
    </button>
    <output aria-label="Selected rows">{{ selectedCount }}</output>
    <DataTable
      ref="table"
      :items="items"
      row-key="id"
      selection
      source="local"
      @selection-change="onSelection"
    >
      <DataTableColumn
        field="name"
        searchable
        sortable
        title="Name"
      >
        <template #cell="{ item, key, index, number }">
          <span
            :data-index="index"
            :data-key="key"
            :data-number="number"
            >{{ item.name }}</span
          >
        </template>
      </DataTableColumn>
      <template #empty>No rows</template>
      <template #noResults>No matches</template>
      <template #loading>Loading</template>
      <template #error="{ error, retry }">
        <button
          type="button"
          @click="retry"
        >
          {{ String(error) }}
        </button>
      </template>
    </DataTable>
  </main>
</template>
