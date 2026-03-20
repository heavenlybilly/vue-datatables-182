<script setup lang="ts">
const props = defineProps<{
  value?: string | number
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
      >{{ props.label }}</span
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
  gap: 4px;
  cursor: pointer;

  .playground-select-label {
    font-size: 11px;
    color: var(--pg-text-muted);
    font-weight: 500;
    line-height: 1;
  }

  .playground-select-input {
    display: block;
    width: 100%;
    padding: 7px 28px 7px 10px;
    border-radius: 6px;
    border: 1px solid var(--pg-input-border);
    outline: none;
    font-size: 12px;
    background: var(--pg-input-bg);
    color: var(--pg-text-primary);
    transition: all 150ms;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%237c7c9a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;

    &:not([disabled]):hover {
      border-color: var(--pg-text-muted);
    }

    &:not([disabled]):focus {
      border-color: var(--pg-accent);
      box-shadow: var(--pg-focus-ring);
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
