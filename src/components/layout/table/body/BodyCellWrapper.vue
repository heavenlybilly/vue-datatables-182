<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  loading: boolean
}>()

const classObject = computed(() => ({
  'dt182-cell--loading': props.loading,
}))
</script>

<template>
  <div
    class="dt182-cell"
    :class="classObject"
  >
    <div class="dt182-cell-content">
      <slot></slot>
    </div>
    <div class="dt182-cell-loader"></div>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-cell {
  position: relative;
  padding: 0.75rem;
  line-height: 1.3;
  vertical-align: middle;
  background-color: vars.$dt182-cell-bg-color;
  transition: background-color vars.$transition-duration ease-in-out;

  &--loading {
    .dt182-cell-content {
      visibility: hidden;
    }

    .dt182-cell-loader {
      visibility: visible;
    }
  }
}

.dt182-cell-content {
  visibility: visible;
}

.dt182-cell-loader {
  position: absolute;
  inset: 0.75rem;
  background: linear-gradient(90deg, #f7f9fb 30%, #f0f2f4 50%, #f7f9fb 70%);
  background-size: 400%;
  border-radius: 5px;
  visibility: hidden;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
