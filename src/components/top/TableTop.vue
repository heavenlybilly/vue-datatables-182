<script setup lang="ts"></script>

<template>
  <div class="data-table-top">
    <div class="data-table-top-left">
      <slot name="topLeftBeforeActions" />
      <slot name="topSearch"></slot>
      <slot name="topLeftAfterActions" />
    </div>
    <div>
      <slot name="topRight" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.data-table-top-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
