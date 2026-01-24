<script setup lang="ts">
const props = defineProps<{
  value?: string | number | null
  options: (string | number)[]
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'input', value: string | number | null): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const selectedValue = target.value

  if (selectedValue === '') {
    emit('input', null)
    return
  }

  const parsed = Number(selectedValue)
  emit('input', Number.isNaN(parsed) ? selectedValue : parsed)
}
</script>

<template>
  <label class="playground-select">
    <span
      v-if="props.label"
      class="playground-select-label"
      >{{ props.label }}:</span
    >
    <select
      class="playground-select-input"
      :disabled="props.disabled"
      :value="props.value"
      @change="handleChange"
    >
      <option value="">Nothing selected</option>
      <option
        v-for="option in props.options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </label>
</template>

<style scoped lang="scss">
.playground-select {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;

  .playground-select-label {
    font-size: 9px;
    color: #989898;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1;
  }

  .playground-select-input {
    display: block;
    width: 100%;
    accent-color: #4848ca;
    padding: 7px 12px;
    border-radius: 3px;
    transition: all 300ms ease-in-out;
    border: 1px solid #ececec;
    outline: none;
    font-size: 11px;

    &:not([disabled]):hover,
    &:not([disabled]):active,
    &:not([disabled]):focus {
      border: 1px solid #4848ca;
    }
  }
}
</style>
