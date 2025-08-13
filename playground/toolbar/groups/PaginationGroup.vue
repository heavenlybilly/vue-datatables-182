<script setup lang="ts">
import VCheckbox from '~/components/VCheckbox.vue'
import VInput from '~/components/VInput.vue'
import VSelect from '~/components/VSelect.vue'
import { useTableParams } from '~/composables/useTableParams'

const { tableParams, setTableParams, displayedRowsPerPageOptions } = useTableParams()

const handlePaginationEnabledSwitch = (value: boolean) => {
  setTableParams({
    paginationEnabled: value,
  })
}

const handleOptionsInput = (value: string | null) => {
  setTableParams({
    rowPerPageOptionsRaw: value ?? '',
  })
}

const handlePerPageInput = (value: string | number | null) => {
  setTableParams({
    rowsPerPage: value ? +value : undefined,
  })
}

const handleShowRangeInfoSwitch = (value: boolean) => {
  setTableParams({
    showRangeInfo: value,
  })
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <div style="display: inline-flex; gap: 15px">
      <v-checkbox
        label="pagination"
        :value="tableParams.paginationEnabled"
        @input="handlePaginationEnabledSwitch"
      />
    </div>

    <div style="display: inline-flex; gap: 15px">
      <v-checkbox
        label="show Range Info"
        :value="tableParams.showRangeInfo"
        @input="handleShowRangeInfoSwitch"
      />
    </div>

    <v-input
      v-if="tableParams.paginationEnabled"
      label="rows Per Page (options)"
      style="width: 100%"
      :value="tableParams.rowPerPageOptionsRaw"
      @input="handleOptionsInput"
    />

    <v-select
      v-if="tableParams.paginationEnabled"
      label="rowsPerPage"
      :options="displayedRowsPerPageOptions ?? []"
      :value="tableParams.rowsPerPage"
      @input="handlePerPageInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
