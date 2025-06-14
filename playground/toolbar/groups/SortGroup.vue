<script setup lang="ts">
import { computed } from 'vue'
import VSelect from '~/components/VSelect.vue'
import { useTableParams } from '~/composables/useTableParams'
import { DTOrderDirection } from '@/types/types'

const { tableParams, setTableParams } = useTableParams()

const handleOrderByInput = (value: string | number | null) => {
  setTableParams({
    orderBy: value ? `${value}` : null,
  })
}

const handleOrderDirectionInput = (value: string | number | null) => {
  setTableParams({
    orderDirection: value === 'asc' ? 'asc' : 'desc',
  })
}

const orderByOptions = computed((): string[] => {
  return []
})

const orderDirectionOptions = computed((): DTOrderDirection[] => {
  return [DTOrderDirection.ASC, DTOrderDirection.DESC]
})
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 15px">
    <v-select
      label="order By"
      :options="orderByOptions"
      :value="tableParams.orderBy"
      @input="handleOrderByInput"
    />

    <v-select
      label="order Direction"
      :options="orderDirectionOptions"
      :value="tableParams.orderDirection"
      @input="handleOrderDirectionInput"
    />
  </div>
</template>

<style scoped lang="scss"></style>
