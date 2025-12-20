<script setup lang="ts">
import { props } from './props'

defineProps(props)
</script>

<template>
  <!-- eslint-disable-next-line -->
  <div v-if="false">
    <slot name="cell" />
  </div>
</template>
