<script setup lang="ts">
import { computed } from 'vue'
import CheckboxElement from '@/components/layout/table/controls/CheckboxElement.vue'
import { CheckboxState } from '@/components/layout/table/types'
import { useMessages } from '../../../localization/use-messages'

const messages = useMessages()
const props = defineProps<{
  disabled: boolean
  selectAllAllowed: boolean
  hasSelection: boolean
  allVisibleSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const checkboxState = computed(() => {
  if (props.allVisibleSelected) {
    return CheckboxState.CHECKED
  }

  return props.hasSelection ? CheckboxState.INDETERMINATE : CheckboxState.UNCHECKED
})

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div
    :aria-label="messages.selection"
    class="dt182-column dt182-column-selection"
    role="columnheader"
  >
    <div class="dt182-column-selection-inner">
      <checkbox-element
        v-if="props.selectAllAllowed"
        :disabled="props.disabled"
        :label="messages.selectAll"
        :value="checkboxState"
        @click="onClick"
      />
    </div>
  </div>
</template>

<style lang="scss">
.dt182-column-selection {
  padding-right: 0;
  padding-left: 0;
  background-color: var(--dt182-header-background, #f3f5f8);

  &-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
