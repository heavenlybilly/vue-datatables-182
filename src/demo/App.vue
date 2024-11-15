<script setup lang="ts">
import DataTable from '@/DataTable.vue'
import DataTableColumn from '@/DataTableColumn.vue'
import { cities } from '@/demo/mocks'
import { ref } from 'vue'

const data = ref(cities)
</script>

<template>
  <div class="wrapper">
    <data-table
      data-source="client"
      :items="data"
      numbering
      row-selection
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
            Действия над ячейкой с номером: <b>{{ row.number }}</b>
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
