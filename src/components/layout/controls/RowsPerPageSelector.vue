<script setup lang="ts">
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
  <div class="dt182-rows-per-page-selector">
    <span>Показать</span>
    <select
      class="dt182-rows-per-page-select"
      :value="props.value"
      @input="onInput"
    >
      <option
        v-for="(item, index) of props.options"
        :key="index"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>

<style lang="scss">
@use '../vars';

.dt182-rows-per-page-selector {
  display: flex;
  align-items: center;
}

.dt182-rows-per-page-select {
  width: 5rem;
  height: 2rem;
  margin: 0 0.32rem;
  padding-top: 0.28rem;
  padding-bottom: 0.28rem;
  padding-left: 0.8rem;
  background-color: vars.$dt182-per-page-control-bg-color;
  border: 1px solid vars.$dt182-per-page-control-border-color;
  border-radius: 5px;
  outline: none;
}
</style>
