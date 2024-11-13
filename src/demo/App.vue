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
        class="text-center"
        field="population"
        orderable
        searchable
        title="Численность населения"
      />
      <data-table-column
        class="text-center"
        field="date_foundation"
        orderable
        searchable
        title="Дата основания"
      />
      <data-table-column
        class="text-center"
        field="order"
        orderable
        searchable
        title="Порядок сортировки"
      />
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
