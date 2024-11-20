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
  <td class="dt182-cell dt182-cell-selection">
    <div class="dt182-cell-selection-inner">
      <input
        :checked="props.checked"
        class="dt182-selection-checkbox"
        type="checkbox"
        @change="(e) => handleSelectRowClick(e, props.index)"
        @click.stop
      />
    </div>
  </td>
</template>
