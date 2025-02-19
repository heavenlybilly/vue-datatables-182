<script setup lang="ts">
// import { DataTable, DataTableColumn } from '@libs/vue-datatables-182'
import { DataTable, DataTableColumn} from '../../src/index'
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

// @ts-ignore
const url = import.meta.env.VITE_URL
</script>

<template>
  <div class="wrapper">
    <data-table
      source="client"
      :items="items"
      :rows-per-page-count="5"
    >
      <data-table-column
        field="order"
        title="Порядок сортировки"
        text-align="center"
        orderable
        width="150px"
      />
      <data-table-column
        field="name"
        title="Наименование"
        searchable
      />
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
        width="140px"
      />
    </data-table>

    <hr>

    <data-table
      source="client"
      :items="items"
      numbering
      row-selection
      scroll-x
      :fixed-columns-start="3"
      :rows-per-page-count="5"
    >
      <data-table-column
        field="order"
        title="Порядок сортировки"
        text-align="center"
        orderable
        width="220px"
      />
      <data-table-column
        field="name"
        title="Наименование"
        searchable
      />
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
      />
    </data-table>

    <hr>

    <data-table
      source="client"
      :items="items"
      numbering
      row-selection
      scroll-x
      :fixed-columns-start="3"
      :rows-per-page-count="5"
    >
      <data-table-column
        field="order"
        title="Порядок сортировки"
        text-align="center"
        orderable
        width="200px"
      />
      <data-table-column
        field="name"
        title="Наименование"
        searchable
        width="800px"
      />
      <data-table-column
        field="population"
        title="Население"
        text-align="center"
        searchable
        width="450px"
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
      />
    </data-table>

<!--    <data-table-->
<!--      source="server"-->
<!--      :url="url"-->
<!--      :rows-per-page-count="5"-->
<!--    >-->
<!--      <data-table-column-->
<!--        field="name"-->
<!--        title="Наименование"-->
<!--        searchable-->
<!--        width="500px"-->
<!--      />-->
<!--      <data-table-column-->
<!--        field="state"-->
<!--        title="Статус"-->
<!--        text-align="center"-->
<!--        searchable-->
<!--        width="250px"-->
<!--      />-->
<!--      <data-table-column-->
<!--        field="updated_at"-->
<!--        title="Дата обновления"-->
<!--        text-align="center"-->
<!--        orderable-->
<!--        width="120px"-->
<!--      />-->
<!--    </data-table>-->
  </div>
</template>

<style lang="scss">
.wrapper {
  padding: 2rem;
}

hr {
  border: none;
  height: 1px;
  background-color: #cdcdcd;
  margin: 35px 0 30px 0;
}
</style>
