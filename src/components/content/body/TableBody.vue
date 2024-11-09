<script setup lang="ts"></script>

<template>
  <tbody class="data-table-tbody">
    <slot></slot>
  </tbody>
</template>

<style scoped lang="scss">
.data-table-tbody {
  tr:not(:last-child) {
    border-bottom: 1px solid #ededf1;
  }
}
</style>
