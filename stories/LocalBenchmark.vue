<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import TableExample from './TableExample.vue'

const count = ref(1000)
const pagination = ref(true)
const elapsed = ref<number | null>(null)
const items = ref(
  Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `Запись ${index + 1}`,
    category: 'Benchmark',
    description: 'Text',
    amount: index,
  })),
)

const canDisablePagination = computed(() => count.value <= 1000 && items.value.length <= 1000)

async function run() {
  const source = Array.from({ length: count.value }, (_, index) => ({
    id: index + 1,
    name: `Запись ${count.value - index}`,
    category: 'Benchmark',
    description: 'Text',
    amount: index,
  }))
  elapsed.value = null
  const start = performance.now()
  items.value = source
  await nextTick()
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
  elapsed.value = Math.round(performance.now() - start)
}
</script>

<template>
  <div>
    <label
      >Число строк
      <select v-model.number="count">
        <option :value="1000">1000</option>
        <option :value="10000">10000</option>
        <option :value="50000">50000</option>
      </select></label
    >
    <label
      ><input
        v-model="pagination"
        :disabled="!canDisablePagination"
        type="checkbox"
      />
      Пагинация</label
    >
    <button
      type="button"
      @click="run"
    >
      Обновить данные и измерить
    </button>
    <p role="status">
      {{ elapsed === null ? 'Результат ещё не измерен' : `Обновление и два кадра: ${elapsed} мс` }}
    </p>
    <p>Для проверки без пагинации используйте 1000 строк. Виртуализация отсутствует.</p>
    <TableExample
      :table-props="{
        items,
        pagination: pagination || !canDisablePagination,
        defaultRowsPerPageCount: 25,
      }"
    />
  </div>
</template>
