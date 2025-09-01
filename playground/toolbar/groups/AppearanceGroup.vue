<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

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
        label="vertical Borders"
        :value="tableParams.verticalBorders"
        @input="handleVerticalBordersSwitch"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
