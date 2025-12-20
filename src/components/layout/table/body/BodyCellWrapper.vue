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
    role="cell"
  >
    <div class="dt182-cell-content">
      <slot></slot>
    </div>
    <div
      v-if="loading"
      aria-hidden="true"
      class="dt182-cell-loader"
    ></div>
  </div>
</template>

<style lang="scss">
@use './cell-overflow';

.dt182-cell {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--dt182-cell-padding-block, var(--dt182-density-padding-block, 0.625rem))
    var(--dt182-cell-padding-inline, 0.75rem);
  line-height: 1.3;
  background-color: var(--dt182-background, #fff);
  transition: background-color var(--dt182-transition-duration, 150ms) ease-in-out;

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
  width: 100%;
  visibility: visible;
}

.dt182-cell-loader {
  position: absolute;
  inset: var(--dt182-cell-padding-block, var(--dt182-density-padding-block, 0.625rem))
    var(--dt182-cell-padding-inline, 0.75rem);
  background: linear-gradient(
    90deg,
    var(--dt182-skeleton-background, #edf0f4) 30%,
    var(--dt182-skeleton-highlight, #f8f9fb) 50%,
    var(--dt182-skeleton-background, #edf0f4) 70%
  );
  background-size: 400%;
  border-radius: 5px;
  animation: dt182-shimmer 1.5s infinite linear;
}

@keyframes dt182-shimmer {
  0% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
