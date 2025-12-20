<script setup lang="ts"></script>

<template>
  <div class="dt182-top">
    <div class="dt182-top-left">
      <slot name="topLeftBeforeActions" />
      <slot name="topSearch"></slot>
      <slot name="topLeftAfterActions" />
    </div>
    <div>
      <slot name="topRight" />
    </div>
  </div>
</template>
