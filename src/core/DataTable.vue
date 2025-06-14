<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DTOrder, DTRow, DTTableData } from '@/types'
import debounce from '@/utils/debounce'
import { useColumns } from '@/core/columns-def/useColumns'
import { props as tableProps, validateTableProps } from '@/core/props'
import { useRowsSelection } from '@/core/rows-selection/useRowsSelection'
import { retrieveTableData } from '@/core/table-data/retrieveTableData'
import { useErrorHandling } from '@/core/useErrorHandling'
import TableBody from '@/components/body/TableBody.vue'
import TableRow from '@/components/body/TableRow.vue'
import TableBottom from '@/components/bottom/TableBottom.vue'
import TableContent from '@/components/content/TableContent.vue'
import TableHead from '@/components/head/TableHead.vue'
import PageDetails from '@/components/page-details/PageDetails.vue'
import PaginationControl from '@/components/pagination/PaginationControl.vue'
import PerPageControl from '@/components/per-page-control/PerPageControl.vue'
import ErrorPlug from '@/components/plugs/ErrorPlug.vue'
import TableSearch from '@/components/search/TableSearch.vue'
import TableTop from '@/components/top/TableTop.vue'

const props = defineProps(tableProps)
const emit = defineEmits(['update:selected-rows', 'row-click', 'loading-start', 'loading-end'])

const search = ref<string>('')
const page = ref<number>(1)
const rowsPerPage = ref<number>(0)
const order = ref<DTOrder | null>(null)
const tableData = ref<DTTableData | null>(null)

const { error, handleError, clearError } = useErrorHandling()
const { columns, initColumns } = useColumns()
const {
  selectedRowIndexes,
  selectedRows,
  isSelectedAll,
  selectRow,
  deselectRow,
  selectAll,
  clearSelection,
} = useRowsSelection(tableData)

const init = async () => {
  try {
    validateTableProps(props)

    initColumns()

    rowsPerPage.value = props.rowsPerPageCount

    if (props.orderBy) {
      order.value = {
        column: props.orderBy,
        direction: props.orderDirection,
      }
    }
  } catch (e) {
    handleError(e)
  }
}

const handleSearchInput = (value: string) => {
  search.value = value
  page.value = 1
  clearSelection()
}

const handleRowsPerPageInput = (value: number) => {
  rowsPerPage.value = value
  page.value = 1
  clearSelection()
}

const handlePageInput = (value: number) => {
  page.value = value
  clearSelection()
}

const handleOrderUpdate = (value: DTOrder) => {
  order.value = value
  clearSelection()
}

const handleSelectAll = () => {
  selectAll()
}

const handleDeselectAll = () => {
  clearSelection()
}

const handleSelectRow = (index: number) => {
  selectRow(index)
}

const handleDeselectRow = (index: number) => {
  deselectRow(index)
}

const handleClickRow = (row: DTRow) => {
  emit('row-click', row)
}

const fetchTableData = async () => {
  emit('loading-start')
  tableData.value = await retrieveTableData({
    source: props.source,
    conf: {
      columns: columns.value,
      searching: props.searching,
      pagination: props.pagination,
    },
    remoteConf: {
      url: props.url,
      method: props.method,
    },
    localConf: {
      items: props.items,
    },
    params: {
      search: search.value,
      rowsPerPage: rowsPerPage.value,
      page: page.value,
      order: order.value,
      filters: props.filters,
    },
  })

  emit('loading-end', tableData.value)
}

const reload = async () => {
  await fetchTableData()
}

defineExpose({
  reload,
})

onMounted(init)

watch(
  [() => search.value, () => rowsPerPage.value, () => page.value, () => order.value],
  debounce(async () => {
    try {
      clearError()
      await fetchTableData()
    } catch (e) {
      handleError(e)
    }
  }, 200),
)

watch(
  () => selectedRows.value,
  debounce((newValue) => {
    emit('update:selected-rows', newValue)
  }, 200),
)
</script>

<template>
  <div class="vue-datatables-182">
    <table-top>
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions" />
      </template>
      <template #topSearch>
        <table-search
          v-if="props.searching"
          :value="search"
          @input="handleSearchInput"
        />
      </template>
      <template #topLeftAfterActions>
        <slot name="topLeftAfterActions" />
      </template>
      <template #topRight>
        <slot name="topRight" />
      </template>
    </table-top>

    <table-content :scroll-x="scrollX">
      <table-head
        :actions="actions"
        :columns="columns"
        :fixed-columns-end="fixedColumnsEnd"
        :fixed-columns-start="fixedColumnsStart"
        :is-selected-all="isSelectedAll"
        :numbering="numbering"
        :order="order"
        :row-selection="rowSelection"
        @deselect-all="handleDeselectAll"
        @select-all="handleSelectAll"
        @update:order="handleOrderUpdate"
      />
      <table-body v-if="tableData">
        <table-row
          v-for="row of tableData.rows"
          :key="row.index"
          :actions="actions"
          :columns="columns"
          :fixed-columns-end="fixedColumnsEnd"
          :fixed-columns-start="fixedColumnsStart"
          :numbering="numbering"
          :row="row"
          :row-selection="rowSelection"
          :rows-clickable="rowsClickable"
          :selected-row-indexes="selectedRowIndexes"
          @click="handleClickRow"
          @deselect-row="handleDeselectRow"
          @select-row="handleSelectRow"
        >
          <template #actions>
            <slot
              :index="row.index"
              :item="row.item"
              name="actions"
              :number="row.number"
            />
          </template>
        </table-row>
      </table-body>
    </table-content>
    <error-plug
      v-if="error"
      :error="error"
    />

    <table-bottom>
      <template #bottomLeft>
        <per-page-control
          v-if="props.pagination"
          :rows-per-page-options="rowsPerPageOptions"
          :value="rowsPerPage"
          @input="handleRowsPerPageInput"
        />
        <page-details
          v-if="tableData"
          :count-items="tableData.rows.length"
          :filtered="tableData.filtered"
          :page="page"
          :rows-per-page="rowsPerPage"
          :total="tableData.total"
        />
      </template>
      <template #bottomRight>
        <pagination-control
          v-if="tableData && props.pagination"
          :filtered="tableData.filtered"
          :page="page"
          :rows-per-page="rowsPerPage"
          @input="handlePageInput"
        />
      </template>
    </table-bottom>

    <slot></slot>
  </div>
</template>
