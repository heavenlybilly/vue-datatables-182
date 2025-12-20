<script setup lang="ts">
import { useMessages } from '../../localization/use-messages'

const messages = useMessages()
const props = defineProps<{
  value: number
  options: number[]
}>()

const emit = defineEmits<{
  (e: 'update:value', payload: number): void
}>()

const onInput = (e: Event) => {
  if (e.target instanceof HTMLSelectElement && e.target.value) {
    emit('update:value', +e.target.value)
  }
}
</script>

<template>
  <label class="dt182-rows-per-page-selector">
    <span>{{ messages.rowsPerPage }}</span>
    <select
      class="dt182-rows-per-page-select"
      :value="props.value"
      @change="onInput"
    >
      <option
        v-for="(item, index) of props.options"
        :key="index"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  </label>
</template>

<style lang="scss">
.dt182-rows-per-page-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.dt182-rows-per-page-select {
  min-width: 4.5rem;
  min-height: var(--dt182-control-height, var(--dt182-density-control-height, 2.25rem));
  padding: 0 0.5rem;
  color: var(--dt182-text-color, #243041);
  font: inherit;
  background: var(--dt182-control-background, #fff);
  border: 1px solid var(--dt182-border-color, #dce2e9);
  border-radius: var(--dt182-border-radius, 0.375rem);
}
</style>
