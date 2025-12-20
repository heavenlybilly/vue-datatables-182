<script setup lang="ts"></script>

<template>
  <div class="dt182-bottom">
    <div class="dt182-bottom-left">
      <slot name="bottomLeft"></slot>
    </div>
    <div class="dt182-bottom-right">
      <slot name="bottomRight"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.dt182-bottom {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: var(--dt182-panel-gap, 0.75rem);
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.dt182-bottom-left,
.dt182-bottom-right {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.dt182-bottom-right {
  margin-left: auto;
}
</style>
