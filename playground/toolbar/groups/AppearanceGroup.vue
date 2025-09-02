<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import VInput from '~/components/VInput.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

const formatValue = (value: number) => {
  return `${value}`
}

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

const handleStickyHeaderSwitch = (value: boolean) => {
  setTableParams({
    stickyHeader: value,
  })
}

const handleVerticalBordersSwitch = (value: boolean) => {
  setTableParams({
    verticalBorders: value,
  })
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
      label="fixedColumnsStart"
      :value="formatValue(tableParams.fixedColumnsStart)"
      @input="handleFixedColumnsStartInput"
    />

    <v-input
      label="fixedColumnsEnd"
      :value="formatValue(tableParams.fixedColumnsEnd)"
      @input="handleFixedColumnsEndInput"
    />

    <div style="display: inline-flex; gap: 15px">
      <v-checkbox
        label="stickyHeader"
        :value="tableParams.stickyHeader"
        @input="handleStickyHeaderSwitch"
      />
    </div>

    <div style="display: inline-flex; gap: 15px">
      <v-checkbox
        label="vertical Borders"
        :value="tableParams.verticalBorders"
        @input="handleVerticalBordersSwitch"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
