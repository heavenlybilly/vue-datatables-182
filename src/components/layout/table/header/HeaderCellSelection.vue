<script setup lang="ts">
import { computed } from 'vue'
import CheckboxElement from '@/components/layout/table/controls/CheckboxElement.vue'
import { CheckboxState } from '@/components/layout/table/types'

const props = defineProps<{
  loading: boolean
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
  <div class="dt182-column-selection">
    <div class="dt182-column-selection-inner">
      <checkbox-element
        v-if="props.selectAllAllowed"
        :disabled="props.loading"
        :value="checkboxState"
        @click="onClick"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-column-selection {
  padding-right: 0;
  padding-left: 0;
  vertical-align: middle;
  background-color: vars.$dt182-head-bg-color;

  &-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
