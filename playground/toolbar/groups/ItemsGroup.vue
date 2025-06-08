<script setup lang="ts">
import { computed } from 'vue'
import VTextarea from '~/components/VTextarea.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

const displayedValue = computed(() => {
  return JSON.stringify(tableParams.value.items ?? [], null, '  ')
})

const handleUrlInput = (value: string | null) => {
  setTableParams({
    items: JSON.parse(value ?? '[]'),
  })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <v-textarea
      label="Items"
      :value="displayedValue"
      @input="handleUrlInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
