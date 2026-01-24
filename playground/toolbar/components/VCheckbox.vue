<script setup lang="ts">
const props = defineProps<{
  value?: boolean
  label?: string
}>()

const emit = defineEmits(['input'])

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('input', event.target.checked)
  }
}
</script>

<template>
  <label class="playground-checkbox">
    <input
      :checked="props.value"
      type="checkbox"
      @change="handleInput"
    />
    <span v-if="props.label">{{ props.label }}</span>
  </label>
</template>

<style scoped lang="scss">
.playground-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: #4848ca;
    margin: 0;
  }

  span {
    margin-top: 1px;
    font-size: 9px;
    color: #989898;
    text-transform: uppercase;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
