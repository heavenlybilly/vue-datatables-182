<script setup lang="ts">
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <td class="dt182-cell dt182-cell-numbering">
    <div class="dt182-cell-numbering-inner">{{ props.number }}</div>
  </td>
</template>
