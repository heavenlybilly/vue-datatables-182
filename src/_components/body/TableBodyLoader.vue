<script setup lang="ts">
import { DTColumn } from '@/types'

const props = defineProps<{
  columns: DTColumn[]
}>()
</script>

<template>
  <div class="dt182-body">
    <div>
      <div
        v-for="(_, index) in props.columns"
        :key="index"
      >
        <div class="dt182-body-skeleton" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
