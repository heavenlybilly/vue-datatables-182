<script setup lang="ts">
const props = defineProps({
  isSelectedAll: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['select-all', 'deselect-all'])

const handleSelectAllClick = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      emits('select-all')
    } else {
      emits('deselect-all')
    }
  }
}
</script>

<template>
  <th class="data-table-th-selection">
    <div class="data-table-th-selection-inner">
      <input
        :checked="props.isSelectedAll"
        type="checkbox"
        @change="handleSelectAllClick"
      />
    </div>
  </th>
</template>

<style scoped lang="scss">
.data-table-th-selection {
  padding: 0.75rem 0;
  width: 30px;
  min-width: 30px;
  max-width: 30px;

  &-inner {
    display: flex;
    justify-content: center;
    align-items: center;

    input {
      cursor: pointer;
      accent-color: #4c4c4c;
    }
  }
}
</style>
