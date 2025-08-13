<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import VInput from '~/components/VInput.vue'
import { useTableParams } from '~/composables/useTableParams'
import { DTMethod } from '@/types'

const { tableParams, setTableParams } = useTableParams()

const handleUrlInput = (value: string | null) => {
  setTableParams({
    url: value,
  })
}

const handleMethodInput = (value: any) => {
  setTableParams({
    method: value ? DTMethod.POST : DTMethod.GET,
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

    <v-checkbox
      label="POST"
      :value="tableParams.method === 'POST'"
      @input="handleMethodInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
