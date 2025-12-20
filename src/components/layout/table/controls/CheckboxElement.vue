<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { CheckboxState } from '../types'

const props = defineProps<{
  value: CheckboxState
  disabled?: boolean
  label?: string
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
const input = ref<HTMLInputElement | null>(null)

async function onClick() {
  if (props.disabled) {
    return
  }

  emit('click')
  await nextTick()

  if (input.value) {
    input.value.checked = props.value === CheckboxState.CHECKED
    input.value.indeterminate = props.value === CheckboxState.INDETERMINATE
  }
}
</script>

<template>
  <span class="dt182-checkbox">
    <input
      ref="input"
      :aria-checked="
        value === CheckboxState.INDETERMINATE ? 'mixed' : value === CheckboxState.CHECKED
      "
      :aria-label="label"
      :checked="value === CheckboxState.CHECKED"
      class="dt182-checkbox-element"
      :disabled="disabled"
      :indeterminate="value === CheckboxState.INDETERMINATE"
      type="checkbox"
      @click.stop="onClick"
    />
    <span
      aria-hidden="true"
      class="dt182-checkbox-icon"
    />
  </span>
</template>

<style lang="scss">
@use './checkbox';
</style>
