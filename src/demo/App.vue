<script setup lang="ts">
import DataTable from '@/DataTable.vue'
import DataTableColumn from '@/DataTableColumn.vue'
import { cities } from '@/demo/mocks'
import { DTRow, DTTable } from '@/types'
import { Ref, ref } from 'vue'

const data = ref(cities)

const tableElement: Ref<DTTable | null> = ref(null)

const handleClickRow = (row: DTRow) => {
  // eslint-disable-next-line
  console.log(row)
}

const url = import.meta.env.VITE_DEMO_TABLE_URL
</script>

<template>
  <div class="wrapper">
    <data-table
      ref="tableElement"
      :items="data"
      numbering
      row-selection
      rows-clickable
      source="server"
      :url="url"
      @click:row="handleClickRow"
    >
      <data-table-column
        field="name"
        orderable
        searchable
        title="Наименование"
      />
      <data-table-column
        field="type_name"
        orderable
        text-align="center"
        title="Тип"
      />
      <data-table-column
        field="subtype_name"
        orderable
        text-align="center"
        title="Подтип"
      />
      <data-table-column
        field="controlled_entity_name"
        text-align="center"
        title="Контролируемое лицо"
      />
      <data-table-column
        field="state"
        text-align="center"
        title="Статус"
      />
      <data-table-column
        field="updated_at"
        orderable
        text-align="center"
        title="Дата обновления"
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
