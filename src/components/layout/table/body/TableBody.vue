<script setup lang="ts"></script>

<template>
  <div class="dt182-body">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.dt182-body {
  &-skeleton {
    height: 30px;
    margin: 10px;
    background-color: #ecf0f7;
    border-radius: 5px;
    animation-name: skeleton;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
  }

  @keyframes skeleton {
    0% {
      opacity: 0.7;
    }

    50% {
      opacity: 0.3;
    }

    100% {
      opacity: 0.7;
    }
  }
}
</style>
