<script setup lang="ts">
import { computed } from 'vue'
import CheckboxElement from '@/components/layout/table/controls/CheckboxElement.vue'
import { CheckboxState } from '@/components/layout/table/types'
import { useMessages } from '../../../localization/use-messages'

const messages = useMessages()
const props = defineProps<{
  disabled: boolean
  selected: boolean
  number: number
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
      :disabled="props.disabled"
      :label="messages.selectRow(number)"
      :value="checkboxState"
      @click="onClick"
    />
  </div>
</template>

<style lang="scss">
.dt182-cell-selection {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
