<script setup lang="ts"></script>

<template>
  <div class="dt182-bottom">
    <div class="dt182-bottom-left">
      <slot name="bottomLeft"></slot>
    </div>
    <div>
      <slot name="bottomRight"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.dt182-bottom {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
}

.dt182-bottom-left {
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.5rem;
  }
}
</style>
