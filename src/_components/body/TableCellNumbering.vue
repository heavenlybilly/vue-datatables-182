<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingContext } from '@/context'

const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
})

const loadingContext = useLoadingContext()

const cellClassObject = computed(() => ({
  'dt182-cell--loading': loadingContext.loading.value,
}))
</script>

<template>
  <div
    class="dt182-cell dt182-cell-numbering"
    :class="cellClassObject"
  >
    <div class="dt182-cell-inner dt182-cell-numbering-inner">{{ props.number }}</div>
    <div class="dt182-cell-loader"></div>
  </div>
</template>
