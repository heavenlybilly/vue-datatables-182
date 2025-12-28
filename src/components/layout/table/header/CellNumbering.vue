<script setup lang="ts"></script>

<template>
  <th class="dt182-column-numbering">
    <div class="dt182-column-numbering-inner">#</div>
  </th>
</template>

<style lang="scss">
@use '../../vars';

.dt182-column-numbering {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  padding-right: 0;
  padding-left: 0;
  vertical-align: middle;
  background-color: vars.$dt182-head-bg-color;

  &-inner {
    text-align: center;
  }
}
</style>
