<script setup lang="ts"></script>
<template>
  <div class="dt182-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@use '../accessibility';
@use '../theme';

.dt182-wrapper {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--dt182-panel-gap, 0.75rem);
  min-width: 0;
  height: 100%;
  min-height: 0;
  max-height: 100%;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}
</style>
