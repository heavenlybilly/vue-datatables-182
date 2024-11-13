<script setup lang="ts">
const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['select-row', 'deselect-row'])

const handleSelectRowClick = (e: Event, index: number) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      emit('select-row', index)
    } else {
      emit('deselect-row', index)
    }
  }
}
</script>

<template>
  <td class="dt-cell-selection">
    <div class="dt-cell-selection-inner">
      <input
        :checked="props.checked"
        type="checkbox"
        @change="(e) => handleSelectRowClick(e, props.index)"
      />
    </div>
  </td>
</template>
