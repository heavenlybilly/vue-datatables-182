<script setup lang="ts">
import { DataTable, DataTableColumn } from '@libs/vue-datatables-182'
// import { DataTable, DataTableColumn} from '../../src/index'
import { items } from './mocks'

const prettifyPopulation = (value: number) => {
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  let index = 0
  let number = value

  while (number >= 1000 && index < abbreviations.length - 1) {
    number /= 1000
    index++
  }

  number = Math.round(number * 100) / 100

  return number + abbreviations[index]
}
</script>

<template>
  <div class="wrapper">
    <data-table
      source="client"
      :items="items"
      numbering
      row-selection
      scroll-x
      :fixed-columns-start="3"
    >
      <data-table-column
        field="order"
        title="Порядок сортировки"
        text-align="center"
        orderable
        width="120px"
      ></data-table-column>
      <data-table-column
        field="name"
        title="Наименование"
        searchable
        width="500px"
      ></data-table-column>
      <data-table-column
        field="population"
        title="Население"
        text-align="center"
        searchable
        width="250px"
      >
        <template #cell="{ row }">
          <div>
            {{ prettifyPopulation(row.item.population) }}
          </div>
        </template>
      </data-table-column>
      <data-table-column
        field="updated_at"
        title="Дата обновления"
        text-align="center"
        orderable
        width="120px"
      ></data-table-column>
    </data-table>
  </div>
</template>

<style lang="scss">
.wrapper {
  padding: 2rem;
}
</style>
