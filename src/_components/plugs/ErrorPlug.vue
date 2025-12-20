<script setup lang="ts">
import { PropType } from 'vue'
import { DTError } from '@/types'

const props = defineProps({
  error: {
    type: Object as PropType<DTError>,
    required: true,
  },
})
</script>

<template>
  <div class="dt182-error">
    <div class="dt182-error-message">
      {{ props.error.message }}
    </div>
    <div
      v-if="props.error?.description"
      class="dt182-error-description"
    >
      {{ props.error.description }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
