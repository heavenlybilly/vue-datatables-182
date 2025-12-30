<script setup lang="ts">
const props = defineProps<{
  number: number
}>()
</script>

<template>
  <div class="dt182-cell-numbering">
    {{ props.number }}
  </div>
</template>

<style lang="scss">
.dt182-cell-numbering {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
