<script setup lang="ts">
import { createTypedTable } from 'vue-datatables-182'

const { DataTable, DataTableColumn } = createTypedTable<{
  id: number
  name: string
}>()
</script>

<template>
  <DataTable
    :items="[
      {
        id: 1,
        name: 'Alice',
      },
    ]"
    row-key="id"
    source="local"
    @row-click="({ item }) => item.name.toUpperCase()"
  >
    <DataTableColumn field="name">
      <template #header="{ title }">
        <span>{{ title.toUpperCase() }}</span>
        <!-- @vue-expect-error -->
        <span :title="title.missing" />
      </template>
      <template #cell="{ item }">
        <span>{{ item.name.toUpperCase() }}</span>
        <!-- @vue-expect-error -->
        <span :title="item.missing" />
      </template>
    </DataTableColumn>
    <!-- @vue-expect-error -->
    <DataTableColumn field="missing" />
    <template #search="{ setValue }">
      <!-- @vue-expect-error -->
      <button
        type="button"
        @click="setValue(1)"
      >
        Invalid search
      </button>
    </template>
    <template #pagination="{ setPage }">
      <!-- @vue-expect-error -->
      <button
        type="button"
        @click="setPage('2')"
      >
        Invalid page
      </button>
    </template>
  </DataTable>
  <!-- @vue-expect-error -->
  <DataTable
    :items="[
      {
        id: 1,
      },
    ]"
    row-key="id"
    source="local"
  />
</template>
