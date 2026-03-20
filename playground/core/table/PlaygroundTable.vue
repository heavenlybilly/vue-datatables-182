<script setup lang="ts">
import { computed } from 'vue'
import { useColumnsStore } from '~/core/columns/store'
import { useEventLogStore } from '~/core/events/store'
import { useTableProps } from '~/core/table/useTableProps'
import { useTableRendering } from '~/useTableRendering'
import DataTable from '@/components/DataTable.vue'
import DataTableColumn from '@/components/DataTableColumn.vue'

const columnsStore = useColumnsStore()
const eventLog = useEventLogStore()
const { tableKey } = useTableRendering()
const { tableProps } = useTableProps()

const visibleColumns = computed(() => columnsStore.columns.filter((c) => c.visible))

const handleUpdatePage = (page: number) => {
  eventLog.addEvent('update:page', page)
}

const handleUpdateRowsPerPageCount = (count: number) => {
  eventLog.addEvent('update:rowsPerPageCount', count)
}

const handleUpdateSearchQuery = (query: string) => {
  eventLog.addEvent('update:searchQuery', query)
}

const handleUpdateSelectedRowKeys = (keys: unknown[]) => {
  eventLog.addEvent('update:selectedRowKeys', keys)
}

const handleSelectionChange = (payload: unknown) => {
  eventLog.addEvent('selectionChange', payload)
}

const handleRowClick = (payload: unknown) => {
  eventLog.addEvent('rowClick', payload)
}

const handleRequestStart = (payload: unknown) => {
  eventLog.addEvent('requestStart', payload)
}

const handleRequestEnd = (payload: unknown) => {
  eventLog.addEvent('requestEnd', payload)
}

const handleRequestError = (payload: unknown) => {
  eventLog.addEvent('requestError', payload)
}

const handleRequestSuccess = (payload: unknown) => {
  eventLog.addEvent('requestSuccess', payload)
}
</script>

<template>
  <data-table
    :key="tableKey"
    v-bind="tableProps"
    @request-end="handleRequestEnd"
    @request-error="handleRequestError"
    @request-start="handleRequestStart"
    @request-success="handleRequestSuccess"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @update:page="handleUpdatePage"
    @update:rows-per-page-count="handleUpdateRowsPerPageCount"
    @update:search-query="handleUpdateSearchQuery"
    @update:selected-row-keys="handleUpdateSelectedRowKeys"
  >
    <data-table-column
      v-for="col of visibleColumns"
      :key="col.field"
      :field="col.field"
      :searchable="col.searchable"
      :sortable="col.sortable"
      :text-align="col.textAlign || undefined"
      :title="col.title"
      :width="col.width || undefined"
    />
  </data-table>
</template>
