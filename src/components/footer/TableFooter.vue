<script setup lang="ts"></script>

<template>
  <div class="dt-footer">
    <div class="dt-footer-left">
      <slot name="footerLeft"></slot>
    </div>
    <div>
      <slot name="footerRight"></slot>
    </div>
  </div>
</template>
