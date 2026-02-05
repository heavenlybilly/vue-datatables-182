<script setup lang="ts">
const props = defineProps<{
  value?: number
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits(['input'])

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('input', +event.target.value)
  }
}
</script>

<template>
  <label class="playground-input">
    <span
      v-if="props.label"
      class="playground-input-label"
      >{{ props.label }}:</span
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
  align-items: center;
  gap: 5px;
  cursor: pointer;

  input[type='text'] {
    display: block;
    width: 100%;
    accent-color: #4848ca;
    padding: 8px 12px;
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

  .playground-input-label {
    display: inline-block;
    margin-bottom: 5px;
    font-size: 9px;
    color: #989898;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
