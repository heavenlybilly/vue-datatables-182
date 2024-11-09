<script setup lang="ts">
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <td class="data-table-td-numbering">
    <div class="data-table-td-numbering-inner">{{ props.number }}</div>
  </td>
</template>

<style scoped lang="scss">
.data-table-td-numbering {
  padding: 0.75rem 1rem;

  &-inner {
    text-align: center;
  }
}
</style>
