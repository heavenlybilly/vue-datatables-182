<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, DataTableColumn, Source } from '../src'
import { rows } from './rows'

const showCategory = ref(true)
const title = ref('Название')
const sticky = ref(false)
</script>

<template>
  <div>
    <p>
      <label
        ><input
          v-model="showCategory"
          type="checkbox"
        />
        Показывать категорию</label
      >
      <label
        ><input
          v-model="sticky"
          type="checkbox"
        />
        Закреплять название</label
      >
      <label
        >Заголовок
        <input
          v-model="title"
          type="text"
      /></label>
    </p>
    <DataTable
      :items="rows"
      row-key="id"
      scroll-x
      :source="Source.LOCAL"
    >
      <DataTableColumn
        key="name"
        field="name"
        sortable
        :sticky="sticky ? 'left' : undefined"
        :title="title"
        width="180px"
      />
      <DataTableColumn
        v-if="showCategory"
        key="category"
        field="category"
        title="Категория"
        width="160px"
      />
      <DataTableColumn
        field="description"
        title="Описание"
        width="900px"
      />
    </DataTable>
  </div>
</template>
