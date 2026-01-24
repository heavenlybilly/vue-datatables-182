<script setup lang="ts">
import { props as tableProps } from '@/core/props'
import { onMounted, ref, watch } from 'vue'
import { DTOrder, DTRow, DTTableData } from '@/types'
import { provideLoadingContext } from '@/context'
import debounce from '@/utils/debounce'
import TableBody from '@/components/body/TableBody.vue'
import TableBodyLoader from '@/components/body/TableBodyLoader.vue'
import TableRow from '@/components/body/TableRow.vue'
import TableContent from '@/components/content/TableContent.vue'
import TableHead from '@/components/head/TableHead.vue'
import NoDataPlug from '@/components/plugs/NoDataPlug.vue'

const props = defineProps(tableProps)
const emit = defineEmits(['update:selected-rows', 'row-click', 'loading-start', 'loading-end'])

const loadingContext = provideLoadingContext()

const search = ref<string>('')
const page = ref<number>(1)
const rowsPerPage = ref<number>(0)
const order = ref<DTOrder | null>(null)
const tableData = ref<DTTableData | null>(null)

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

const deselectAllRows = () => {
  clearSelection()
}

defineExpose({
  reload,
  deselectAllRows,
})

onMounted(init)

watch(
  [() => search.value, () => rowsPerPage.value, () => page.value, () => order.value],
  debounce(async () => {
    loadingContext.setLoading(true)
    try {
      await fetchTableData()
    } catch (e) {
      handleError(e)
    }
    loadingContext.setLoading(false)
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
    <table-content :scroll-x="props.scrollX">
      <table-head
        :actions="actions"
        :columns="columns"
        :disallow-select-all="props.disallowSelectAll"
        :fixed-columns-end="fixedColumnsEnd"
        :fixed-columns-start="fixedColumnsStart"
        :is-selected-all="isSelectedAll"
        :numbering="numbering"
        :order="order"
        :row-selection="rowSelection"
        :sticky-header="props.stickyHeader"
        :vertical-borders="props.verticalBorders"
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
          :select-on-row-click="props.selectOnRowClick"
          :selected-row-indexes="selectedRowIndexes"
          :vertical-borders="props.verticalBorders"
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
      <table-body-loader
        v-else
        :columns="columns"
      />
    </table-content>
    <no-data-plug v-if="tableData && tableData.filtered === 0" />
  </div>
</template>
