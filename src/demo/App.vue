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
      actions
      data-source="client"
      :fixed-columns-end="1"
      :fixed-columns-start="2"
      :items="data"
      numbering
      row-selection
      scroll-x
    >
      <data-table-column
        field="title"
        orderable
        searchable
        title="Наименование"
        width="400px"
      />
      <data-table-column
        align="center"
        field="population"
        orderable
        searchable
        title="Численность населения"
        width="200px"
      />
      <data-table-column
        align="center"
        field="population"
        orderable
        searchable
        title="Население"
        width="200px"
      />
      <data-table-column
        align="center"
        field="population"
        orderable
        searchable
        title="Популяция"
        width="200px"
      />
      <data-table-column
        align="center"
        field="population"
        orderable
        searchable
        title="Численность"
        width="200px"
      />
      <data-table-column
        align="center"
        field="date_foundation"
        orderable
        searchable
        title="Дата основания"
        width="150px"
      />
      <data-table-column
        align="center"
        field="order"
        orderable
        searchable
        title="Порядок сортировки"
        width="150px"
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
