<script setup lang="ts"></script>

<template>
  <div class="dt-top">
    <div class="dt-top-left">
      <slot name="topLeftBeforeActions" />
      <slot name="topSearch"></slot>
      <slot name="topLeftAfterActions" />
    </div>
    <div>
      <slot name="topRight" />
    </div>
  </div>
</template>
