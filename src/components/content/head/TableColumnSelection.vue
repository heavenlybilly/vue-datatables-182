<script setup lang="ts">
const props = defineProps({
  isSelectedAll: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['select-all', 'deselect-all'])

const handleSelectAllClick = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      emit('select-all')
    } else {
      emit('deselect-all')
    }
  }
}
</script>

<template>
  <th class="dt182-column dt182-column-selection">
    <div class="dt182-column-selection-inner">
      <input
        :checked="props.isSelectedAll"
        class="dt182-selection-checkbox"
        type="checkbox"
        @change="handleSelectAllClick"
      />
    </div>
  </th>
</template>
