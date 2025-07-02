<script setup lang="ts">
import { DTColumn } from '@/types'

const props = defineProps<{
  columns: DTColumn[]
}>()
</script>

<template>
  <tbody class="dt182-body">
    <tr>
      <td
        v-for="(columns, index) in props.columns"
        :key="index"
      >
        <div class="dt182-body-skeleton" />
      </td>
    </tr>
  </tbody>
</template>

<style lang="scss"></style>
