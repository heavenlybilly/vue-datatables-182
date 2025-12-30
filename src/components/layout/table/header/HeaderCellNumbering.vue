<script setup lang="ts"></script>

<template>
  <div class="dt182-column-numbering">
    <div class="dt182-column-numbering-inner">#</div>
  </div>
</template>

<style lang="scss">
@use '../../vars';

.dt182-column-numbering {
  padding-right: 0;
  padding-left: 0;
  vertical-align: middle;
  background-color: vars.$dt182-head-bg-color;

  &-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
</style>
