<script setup lang="ts">
import { computed } from 'vue'
import iconChecked from '@/assets/selection-checked.svg'
import iconIndeterminate from '@/assets/selection-indeterminate.svg'
import iconUnchecked from '@/assets/selection-unchecked.svg'
import { CheckboxState } from '@/components/layout/table/types'

const props = defineProps<{
  value: CheckboxState
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const icon = computed(() => {
  if (props.value === CheckboxState.INDETERMINATE) {
    return iconIndeterminate
  }

  return props.value === CheckboxState.CHECKED ? iconChecked : iconUnchecked
})

const onClick = () => {
  if (props.disabled) {
    return
  }

  emit('click')
}
</script>

<template>
  <div
    class="dt182-checkbox-element"
    :class="{ 'dt182-checkbox-element-disabled': props.disabled }"
    @click="onClick"
    v-html="icon"
  ></div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-checkbox-element {
  cursor: pointer;
  color: vars.$select-row-checkbox-accent-color;

  &.dt182-checkbox-element-disabled {
    color: vars.$select-row-checkbox-disabled-color;
    cursor: not-allowed;
  }
}
</style>
