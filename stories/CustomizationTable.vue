<script setup lang="ts">
import { createTypedTable } from '../src'
import './customization.scss'

type Item = {
  id: number
  name: string
  description: string
  amount: number
}

const { DataTable, DataTableColumn } = createTypedTable<Item>()

withDefaults(
  defineProps<{
    theme?: 'default' | 'dark' | 'minimal'
    density?: 'comfortable' | 'compact'
    customControls?: boolean
    longHeaders?: boolean
    pinned?: boolean
  }>(),
  {
    theme: 'default',
    density: 'comfortable',
    customControls: false,
    longHeaders: false,
    pinned: true,
  },
)

const items: Item[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  name: `Project ${index + 1}`,
  description: 'A long description with additional details about this project.',
  amount: (index + 1) * 125.5,
}))
</script>

<template>
  <DataTable
    class="customization-table"
    :class="`customization-table-${theme}`"
    :default-rows-per-page-count="5"
    :default-selected-row-keys="[1]"
    :density="density"
    :items="items"
    row-key="id"
    :rows-per-page-options="[5, 10]"
    scroll-x
    selection
    source="local"
    sticky-header
    striped
  >
    <DataTableColumn
      field="id"
      :sticky="pinned ? 'left' : undefined"
      title="ID"
      width="64px"
    />
    <DataTableColumn
      field="name"
      :header-text-overflow="longHeaders ? 'wrap' : 'ellipsis'"
      searchable
      sortable
      :sticky="pinned ? 'left' : undefined"
      :title="longHeaders ? 'Project name and additional information' : 'Project'"
      width="180px"
    >
      <template #header="{ title }"
        ><span>{{ title }}</span></template
      >
    </DataTableColumn>
    <DataTableColumn
      field="description"
      text-overflow="ellipsis"
      title="Description"
      width="minmax(200px, 1fr)"
    />
    <DataTableColumn
      class="customization-number"
      field="amount"
      sortable
      :sticky="pinned ? 'right' : undefined"
      text-align="right"
      title="Amount"
      width="120px"
    >
      <template #cell="{ item }">{{ item.amount.toFixed(2) }}</template>
    </DataTableColumn>
    <template #topRight="{ selectedCount, clearSelection }">
      <button
        class="customization-control"
        :disabled="!selectedCount"
        type="button"
        @click="clearSelection"
      >
        Clear selection ({{ selectedCount }})
      </button>
    </template>
    <template
      v-if="customControls"
      #search="{ value, setValue }"
    >
      <input
        aria-label="Custom search"
        class="customization-control"
        :value="value"
        @input="setValue(($event.target as HTMLInputElement).value)"
      />
    </template>
    <template
      v-if="customControls"
      #rowsPerPage="{ value, options, setValue }"
    >
      <label>
        Page size
        <select
          class="customization-control"
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
      </label>
    </template>
    <template
      v-if="customControls"
      #pagination="{ page, pageCount, setPage }"
    >
      <button
        class="customization-control"
        :disabled="page <= 1"
        type="button"
        @click="setPage(page - 1)"
      >
        Previous
      </button>
      <span>{{ page }} / {{ pageCount }}</span>
      <button
        class="customization-control"
        :disabled="page >= pageCount"
        type="button"
        @click="setPage(page + 1)"
      >
        Next
      </button>
    </template>
  </DataTable>
</template>
