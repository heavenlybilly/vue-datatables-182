<script setup lang="ts">
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <td class="dt-cell-numbering">
    <div class="dt-cell-numbering-inner">{{ props.number }}</div>
  </td>
</template>
