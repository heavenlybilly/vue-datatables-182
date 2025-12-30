<script setup lang="ts">
import { computed } from 'vue'
import CheckboxElement from '@/components/layout/table/controls/CheckboxElement.vue'
import { CheckboxState } from '@/components/layout/table/types'

const props = defineProps<{
  loading: boolean
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const checkboxState = computed(() => {
  return props.selected ? CheckboxState.CHECKED : CheckboxState.UNCHECKED
})

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div class="dt182-cell-selection">
    <checkbox-element
      :disabled="props.loading"
      :value="checkboxState"
      @click="onClick"
    />
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-cell-selection {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
