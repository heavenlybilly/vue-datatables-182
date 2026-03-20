<script setup lang="ts">
const props = defineProps<{
  value?: number
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits(['input'])

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    const raw = event.target.value
    emit('input', raw === '' ? undefined : +raw)
  }
}
</script>

<template>
  <label class="playground-input">
    <span
      v-if="props.label"
      class="playground-input-label"
      >{{ props.label }}</span
    >
    <input
      :disabled="props.disabled"
      type="text"
      :value="props.value"
      @input="handleInput"
    />
  </label>
</template>

<style scoped lang="scss">
.playground-input {
  display: block;
  cursor: pointer;

  input[type='text'] {
    display: block;
    width: 100%;
    padding: 7px 10px;
    border-radius: 6px;
    border: 1px solid var(--pg-input-border);
    outline: none;
    font-size: 12px;
    background: var(--pg-input-bg);
    color: var(--pg-text-primary);
    transition: all 150ms;

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

  .playground-input-label {
    display: inline-block;
    margin-bottom: 4px;
    font-size: 11px;
    color: var(--pg-text-muted);
    font-weight: 500;
    line-height: 1;
  }
}
</style>
