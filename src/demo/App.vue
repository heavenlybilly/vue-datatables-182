<script setup lang="ts">
import DataTable from '@/DataTable.vue'
import DataTableColumn from '@/DataTableColumn.vue'
import { cities } from '@/demo/mocks'
import { DTRow } from '@/types'
import { ref } from 'vue'

const data = ref(cities)

const handleClickRow = (row: DTRow) => {
  // eslint-disable-next-line
  console.log(row)
}
</script>

<template>
  <div class="wrapper">
    <data-table
      actions
      data-source="client"
      :items="data"
      numbering
      row-selection
      rows-clickable
      @click:row="handleClickRow"
    >
      <data-table-column
        field="title"
        orderable
        searchable
        title="Наименование"
      />
      <data-table-column
        field="population"
        orderable
        searchable
        text-align="center"
        title="Численность населения"
      />
      <data-table-column
        field="date_foundation"
        orderable
        searchable
        text-align="center"
        title="Дата основания"
      />
      <data-table-column
        field="order"
        orderable
        searchable
        text-align="center"
        title="Порядок сортировки"
      />

      <template #actions="{ row }">
        <div>
          <span>
            <b>{{ row.number }}</b>
          </span>
        </div>
      </template>
    </data-table>
  </div>
</template>

<style lang="scss">
.wrapper {
  padding: 2rem;
}

.text-center {
  text-align: center;
}
</style>
