<script setup lang="ts">
import { ref } from 'vue'
import { type SelectionChangePayload, createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

type Item = {
  id: number
  name: string
}

const { DataTable, DataTableColumn } = createTypedTable<Item>()

const table = ref<InstanceType<typeof DataTable>>()
const items = [
  {
    id: 1,
    name: 'Tarball consumer',
  },
]
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
      density="compact"
      :items="items"
      row-key="id"
      selection
      source="local"
      @selection-change="onSelection"
    >
      <DataTableColumn
        field="name"
        header-text-overflow="wrap"
        searchable
        sortable
        text-overflow="ellipsis"
        title="Name"
      >
        <template #header="{ title }"
          ><span>{{ title.toUpperCase() }}</span></template
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
      <template #topRight="{ selectedCount: count, loading, clearSelection, reload: refresh }">
        <button
          :disabled="loading || !count"
          type="button"
          @click="clearSelection"
        >
          Clear {{ count }}
        </button>
        <button
          :disabled="loading"
          type="button"
          @click="refresh"
        >
          Refresh
        </button>
      </template>
      <template #search="{ value, setValue }">
        <input
          aria-label="Search"
          :value="value"
          @input="setValue(($event.target as HTMLInputElement).value)"
        />
      </template>
      <template #rowsPerPage="{ value, options, setValue }">
        <select
          aria-label="Page size"
          :value="value"
          @change="setValue(Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="option in options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </template>
      <template #pagination="{ page, pageCount, setPage }">
        <button
          :disabled="page >= pageCount"
          type="button"
          @click="setPage(page + 1)"
        >
          Next {{ page }}
        </button>
      </template>
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
