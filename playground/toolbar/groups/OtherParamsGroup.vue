<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams } = useTableParams()

const handleSearchingSwitch = (value: boolean) => {
  setTableParams({
    searching: value,
  })
}

const handleRowSelectionSwitch = (value: boolean) => {
  setTableParams({
    rowSelection: value,
  })
}

const handleActionsSwitch = (value: boolean) => {
  setTableParams({
    actions: value,
  })
}

const handleNumberingSwitch = (value: boolean) => {
  setTableParams({
    numbering: value,
  })
}

const handleRowsClickableSwitch = (value: boolean) => {
  setTableParams({
    rowsClickable: value,
  })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div style="display: inline-flex; gap: 15px; flex-direction: column">
      <v-checkbox
        label="searching"
        :value="tableParams.searching"
        @input="handleSearchingSwitch"
      />

      <v-checkbox
        label="row Selection"
        :value="tableParams.rowSelection"
        @input="handleRowSelectionSwitch"
      />

      <v-checkbox
        label="actions"
        :value="tableParams.actions"
        @input="handleActionsSwitch"
      />

      <v-checkbox
        label="numbering"
        :value="tableParams.numbering"
        @input="handleNumberingSwitch"
      />

      <v-checkbox
        label="rowsClickable"
        :value="tableParams.rowsClickable"
        @input="handleRowsClickableSwitch"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
