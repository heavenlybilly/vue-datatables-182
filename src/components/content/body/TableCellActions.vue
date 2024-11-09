<script setup lang="ts"></script>

<template>
  <td class="data-table-td-actions">
    <div class="data-table-td-actions-inner">
      <slot></slot>
    </div>
  </td>
</template>

<style scoped lang="scss">
.data-table-td-actions {
  width: min-content;
  padding: 0.75rem 1rem;

  &-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
