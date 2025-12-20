<script setup lang="ts">
import { DataTable, DataTableColumn, Source } from '../src'
import type { DataTableProps } from '../src'
import { rows } from './rows'

withDefaults(
  defineProps<{
    tableProps?: Partial<DataTableProps>
    bounded?: boolean
    wide?: boolean
    pinned?: boolean
    customCell?: boolean
    customStates?: boolean
  }>(),
  { tableProps: () => ({}) },
)
</script>

<template>
  <div :class="['story-table', { 'story-table-bounded': bounded }]">
    <DataTable
      :items="rows"
      row-key="id"
      :source="Source.LOCAL"
      v-bind="tableProps"
    >
      <DataTableColumn
        field="id"
        :sticky="pinned ? 'left' : undefined"
        title="ID"
        width="80px"
      />
      <DataTableColumn
        field="name"
        searchable
        sortable
        :sticky="pinned ? 'left' : undefined"
        title="Название"
        width="180px"
      />
      <DataTableColumn
        field="category"
        searchable
        sortable
        title="Категория"
        width="160px"
      />
      <DataTableColumn
        field="description"
        title="Описание"
        :width="wide ? '900px' : undefined"
      />
      <DataTableColumn
        field="amount"
        sortable
        :sticky="pinned ? 'right' : undefined"
        text-align="right"
        title="Сумма"
        width="140px"
      >
        <template
          v-if="customCell"
          #cell="{ item, key, index, number }"
        >
          <strong>{{ item.amount }} ₽</strong>
          <small>Ключ: {{ key }}; индекс: {{ index }}; номер: {{ number }}</small>
        </template>
      </DataTableColumn>
      <template
        v-if="customStates"
        #empty
        >Здесь пока нет записей</template
      >
      <template
        v-if="customStates"
        #noResults
        >Попробуйте другой поисковый запрос</template
      >
      <template
        v-if="customStates"
        #loading
        >Загружаем записи…</template
      >
      <template
        v-if="customStates"
        #error="{ retry }"
      >
        <p>Запрос не выполнен</p>
        <button
          type="button"
          @click="retry"
        >
          Повторить запрос
        </button>
      </template>
    </DataTable>
  </div>
</template>
