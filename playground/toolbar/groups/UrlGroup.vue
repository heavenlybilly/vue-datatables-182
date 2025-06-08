<script setup lang="ts">
import VInput from '~/components/VInput.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

const handleUrlInput = (value: string | null) => {
  setTableParams({
    url: value,
  })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <v-input
      label="Url"
      :value="tableParams.url"
      @input="handleUrlInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
