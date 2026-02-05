<script setup lang="ts">
import { ToolbarState } from '~/types'

const props = defineProps<{
  value: ToolbarState
}>()

const emit = defineEmits(['input'])

const handleExpandClick = () => {
  switch (props.value) {
    case ToolbarState.COLLAPSED:
      emit('input', ToolbarState.EXPANDED)
      break
    case ToolbarState.EXPANDED:
      emit('input', ToolbarState.FULL_EXPANDED)
      break
    case ToolbarState.FULL_EXPANDED:
      emit('input', ToolbarState.COLLAPSED)
      break
    default: {
      const _: never = props.value
    }
  }
}
</script>

<template>
  <div
    class="playground-expand-btn"
    @click="handleExpandClick"
  >
    <i
      v-if="props.value === ToolbarState.COLLAPSED"
      class="fa fa-chevron-left"
    />
    <i
      v-else-if="props.value === ToolbarState.EXPANDED"
      class="fa fa-chevron-left"
    />
    <i
      v-else-if="props.value === ToolbarState.FULL_EXPANDED"
      class="fa fa-chevron-right"
    />
  </div>
</template>

<style scoped lang="scss">
.playground-expand-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 200ms ease-in-out;
  color: #4848ca;

  &:hover {
    background-color: #dedef4;
  }
}
</style>
