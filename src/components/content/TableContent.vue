<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  scrollX: {
    type: Boolean,
    required: true,
  },
})

const tableContentClassObject = computed(() => ({
  'scroll-x': props.scrollX,
}))
</script>

<template>
  <div
    class="data-table-content"
    :class="tableContentClassObject"
  >
    <table>
      <slot></slot>
    </table>
  </div>
</template>

<style scoped lang="scss">
.data-table-content {
  border-radius: 5px;
  border: 1px solid #ededf1;
  overflow: hidden;

  table {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }

  &.scroll-x {
    overflow-x: scroll;
  }
}
</style>
