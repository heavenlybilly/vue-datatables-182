<script lang="ts">
import { tableProps, validateTableProps } from '@/props'
import { DTOrder, DTRow } from '@/types'
import Vue, { defineComponent, getCurrentInstance, onMounted, toRefs, watch } from 'vue'
import debounce from '@/helpers/debounce'
import ErrorPlug from '@/components/ErrorPlug.vue'
import TableContent from '@/components/content/TableContent.vue'
import TableBody from '@/components/content/body/TableBody.vue'
import TableRow from '@/components/content/body/TableRow.vue'
import TableHead from '@/components/content/head/TableHead.vue'
import TableFooter from '@/components/footer/TableFooter.vue'
import PageDetails from '@/components/footer/page-details/PageDetails.vue'
import TablePagination from '@/components/footer/pagination/TablePagination.vue'
import RowsPerPageControl from '@/components/footer/rows-per-page-control/RowsPerPageControl.vue'
import TableTop from '@/components/top/TableTop.vue'
import TableSearch from '@/components/top/search/TableSearch.vue'
import { useData } from '@/composables/data/useData'
import { useColumns } from '@/composables/useColumns'
import { useErrors } from '@/composables/useErrors'
import { useOrder } from '@/composables/useOrder'
import { usePagination } from '@/composables/usePagination'
import { useRowSelection } from '@/composables/useRowSelection'
import { useSearch } from '@/composables/useSearch'
import '@/scss/index.scss'

export default defineComponent({
  name: 'DataTable',
  components: {
    ErrorPlug,
    TableRow,
    TableContent,
    TableFooter,
    TableTop,
    TableSearch,
    TablePagination,
    PageDetails,
    RowsPerPageControl,
    TableBody,
    TableHead,
  },
  props: tableProps,
  emits: ['update:selected-rows', 'click:row'],
  setup(props, { emit }) {
    const { source, url, items, searching, pagination } = toRefs(props)

    const { error, handleError } = useErrors()
    const { columns, initColumns } = useColumns()
    const { page, rowsPerPage, setPage, setRowsPerPage } = usePagination()
    const { search, setSearch } = useSearch()
    const { order, setOrder } = useOrder()
    const { tableData, fetchTableData } = useData(source, url, items, columns, {
      searching,
      search,
      pagination,
      rowsPerPage,
      page,
      order,
    })
    const {
      selectedRowIndexes,
      selectedRows,
      isSelectedAll,
      selectRow,
      deselectRow,
      selectAll,
      clearSelection,
    } = useRowSelection(tableData)

    const init = async () => {
      try {
        validateTableProps(props)

        const instance = getCurrentInstance() as { proxy: Vue }
        initColumns(instance.proxy)

        setRowsPerPage(props.rowsPerPageCount)

        if (props.orderBy) {
          setOrder({
            column: props.orderBy,
            direction: props.orderDirection,
          })
        }
      } catch (e) {
        handleError(e)
      }
    }

    const handleSearchInput = (value: string) => {
      setSearch(value)
      setPage(1)
      clearSelection()
    }

    const handleRowsPerPageInput = (value: number) => {
      setRowsPerPage(value)
      setPage(1)
      clearSelection()
    }

    const handlePageInput = (value: number) => {
      setPage(value)
      clearSelection()
    }

    const handleOrderUpdate = (value: DTOrder) => {
      setOrder(value)
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
      emit('click:row', row)
    }

    const reload = async () => {
      await fetchTableData()
    }

    onMounted(init)

    watch(
      [() => search.value, () => rowsPerPage.value, () => page.value, () => order.value],
      debounce(async () => {
        try {
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

    return {
      error,
      search,
      page,
      rowsPerPage,
      order,
      columns,
      tableData,
      selectedRowIndexes,
      isSelectedAll,
      handleSearchInput,
      handleRowsPerPageInput,
      handlePageInput,
      handleOrderUpdate,
      handleSelectAll,
      handleDeselectAll,
      handleSelectRow,
      handleDeselectRow,
      handleClickRow,
      reload,
    }
  },
})
</script>

<template>
  <div class="dt-wrapper">
    <table-top>
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions" />
      </template>
      <template #topSearch>
        <table-search
          v-if="searching"
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
        v-if="tableData"
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
              name="actions"
              :row="row"
            />
          </template>
        </table-row>
      </table-body>
    </table-content>
    <error-plug
      v-if="error"
      :error="error"
    />

    <table-footer>
      <template #footerLeft>
        <rows-per-page-control
          v-if="pagination"
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
      <template #footerRight>
        <table-pagination
          v-if="tableData && pagination"
          :filtered="tableData.filtered"
          :page="page"
          :rows-per-page="rowsPerPage"
          @input="handlePageInput"
        />
      </template>
    </table-footer>

    <slot></slot>
  </div>
</template>
