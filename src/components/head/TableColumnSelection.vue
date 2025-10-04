<script setup lang="ts">
import { useLoadingContext } from '@/context'

const props = defineProps({
  isSelectedAll: {
    type: Boolean,
    required: true,
  },
  disallowSelectAll: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['select-all', 'deselect-all'])

const loadingContext = useLoadingContext()

const handleSelectAllClick = () => {
  if (props.isSelectedAll) {
    emit('deselect-all')
  } else {
    emit('select-all')
  }
}
</script>

<template>
  <th class="dt182-column-selection">
    <div class="dt182-column-selection-inner">
      <div
        v-if="!props.disallowSelectAll && !loadingContext.loading.value"
        class="dt182-selection-checkbox"
        :class="{ checked: props.isSelectedAll }"
        @click.stop="handleSelectAllClick"
      >
        <span v-if="props.isSelectedAll">&#10004;</span>
      </div>
    </div>
  </th>
</template>
