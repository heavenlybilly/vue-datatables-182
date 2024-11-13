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
  <th class="dt-column dt-column-selection">
    <div class="dt-column-selection-inner">
      <input
        :checked="props.isSelectedAll"
        type="checkbox"
        @change="handleSelectAllClick"
      />
    </div>
  </th>
</template>
