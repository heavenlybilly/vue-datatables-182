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
    class="dt182-content"
    :class="tableContentClassObject"
  >
    <table class="dt182-table">
      <slot></slot>
    </table>
  </div>
</template>

<style lang="scss"></style>
