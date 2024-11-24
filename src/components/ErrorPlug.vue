<script setup lang="ts">
import { PropType } from 'vue'
import { DTError } from '@/types/types'

const props = defineProps({
  error: {
    type: Object as PropType<DTError>,
    required: true,
  },
})
</script>

<template>
  <div class="dt-error">
    <div class="dt-error-message">
      {{ props.error.message }}
    </div>
    <div
      v-if="props.error?.description"
      class="dt-error-description"
    >
      {{ props.error.description }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
