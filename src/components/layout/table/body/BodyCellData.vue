<script setup lang="ts">
import { computed } from 'vue'
import decodeString from '../../../utils/decode-string'

const props = defineProps<{
  content: any
}>()

const prettifiedValues = computed(() => {
  if (props.content === null || props.content === undefined) {
    return ''
  }

  if (typeof props.content === 'string') {
    return decodeString(props.content)
  }

  return props.content
})
</script>

<template>
  <div>
    {{ prettifiedValues }}
  </div>
</template>

<style lang="scss"></style>
