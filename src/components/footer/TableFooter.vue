<script setup lang="ts"></script>

<template>
  <div class="data-table-footer">
    <div class="data-table-footer-left">
      <slot name="footerLeft"></slot>
    </div>
    <div>
      <slot name="footerRight"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-footer {
  margin-top: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table-footer-left {
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.5rem;
  }
}
</style>
