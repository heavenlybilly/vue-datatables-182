<script setup lang="ts">
import '@andypf/json-viewer'
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string
  value: object
}>()

const isShow = ref(true)

watch(
  () => props.value,
  () => {
    isShow.value = false
    setTimeout(() => {
      isShow.value = true
    }, 10)
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div class="playground-state-viewer">
    <div v-if="isShow">
      <andypf-json-viewer
        indent="2"
        expanded="true"
        theme="one-light"
        show-data-types="true"
        show-toolbar="false"
        expand-icon-type="square"
        show-copy="true"
        show-size="true"
        :data='JSON.stringify(props.value)'
      ></andypf-json-viewer>
    </div>

  </div>
</template>

<style scoped lang="scss">
.playground-state-viewer {
  max-height: 400px;
  overflow-y: auto;
}
</style>
