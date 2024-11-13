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

const emit = defineEmits(['input'])

const handleInput = (e: Event) => {
  if (e.target instanceof HTMLSelectElement && e.target.value) {
    emit('input', +e.target.value)
  }
}
</script>

<template>
  <div class="flex items-center">
    <span>Показать</span>
    <select
      class="dt-rows-per-page"
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
