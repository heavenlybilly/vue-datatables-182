<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingContext } from '@/context'

const loadingContext = useLoadingContext()

const cellClassObject = computed(() => ({
  'dt182-cell--loading': loadingContext.loading.value,
}))
</script>

<template>
  <td
    class="dt182-cell dt182-cell-actions"
    :class="cellClassObject"
  >
    <div class="dt182-cell-inner dt182-cell-actions-inner">
      <slot></slot>
    </div>
    <div class="dt182-cell-loader"></div>
  </td>
</template>
