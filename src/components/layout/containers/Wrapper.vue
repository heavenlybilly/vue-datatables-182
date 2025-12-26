<script setup lang="ts"></script>
<template>
  <div class="dt182-wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.dt182-wrapper {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  height: 100%;
  max-height: 100%;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}
</style>
