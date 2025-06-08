<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import VInput from '~/components/VInput.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

const handleScrollXSwitch = (value: boolean) => {
  setTableParams({
    scrollX: value,
  })
}

const handleFixedColumnsStartInput = (value: string | null) => {
  setTableParams({
    fixedColumnsStart: value ? +value : 0,
  })
}

const handleFixedColumnsEndInput = (value: string | null) => {
  setTableParams({
    fixedColumnsEnd: value ? +value : 0,
  })
}

const formatValue = (value: number) => {
  return `${value}`
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div style="display: inline-flex; gap: 15px">
      <v-checkbox
        label="scrollX"
        :value="tableParams.scrollX"
        @input="handleScrollXSwitch"
      />
    </div>

    <v-input
      v-if="tableParams.scrollX"
      label="fixedColumnsStart"
      :value="formatValue(tableParams.fixedColumnsStart)"
      @input="handleFixedColumnsStartInput"
    />

    <v-input
      v-if="tableParams.scrollX"
      label="fixedColumnsEnd"
      :value="formatValue(tableParams.fixedColumnsEnd)"
      @input="handleFixedColumnsEndInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
