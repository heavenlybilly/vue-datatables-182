<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  value: {
    type: Number as PropType<number>,
    required: true,
  },
  rowsPerPageOptions: {
    type: Array as PropType<number[]>,
    required: true,
  },
})

const emits = defineEmits(['input'])

const handleInput = (e: Event) => {
  if (e.target instanceof HTMLSelectElement && e.target.value) {
    emits('input', +e.target.value)
  }
}
</script>

<template>
  <div class="flex items-center">
    <span>Показать</span>
    <select
      class="data-table-rows-per-page"
      :value="props.value"
      @input="handleInput"
    >
      <option
        v-for="(item, index) of props.rowsPerPageOptions"
        :key="index"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.data-table-rows-per-page {
  width: 80px;
  height: 32px;
  padding-top: 0.28rem;
  padding-bottom: 0.28rem;
  padding-left: 0.8rem;
  background-color: #fff;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ced4da;
  margin: 0 5px;
}
</style>
