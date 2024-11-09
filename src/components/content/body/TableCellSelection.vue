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

const emits = defineEmits(['select-row', 'deselect-row'])

const handleSelectRowClick = (e: Event, index: number) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      emits('select-row', index)
    } else {
      emits('deselect-row', index)
    }
  }
}
</script>

<template>
  <td class="data-table-td-row-selection">
    <div class="data-table-td-row-selection-inner">
      <input
        :checked="props.checked"
        type="checkbox"
        @change="(e) => handleSelectRowClick(e, props.index)"
      />
    </div>
  </td>
</template>

<style scoped lang="scss">
.data-table-td-row-selection {
  padding: 0.75rem 0;

  &-inner {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    input {
      cursor: pointer;
      accent-color: #4c4c4c;
    }
  }
}
</style>
