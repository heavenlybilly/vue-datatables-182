<script setup lang="ts">
import { onMounted } from 'vue'
import { useColumnsSchema } from '@/features/columns-schema'
import { useDataParams } from '@/features/data-params'
import { TableLayout } from '@/features/layout-engine'
import { props as tableProps, validateTableProps } from './props'

const props = defineProps(tableProps)

const { initColumns } = useColumnsSchema()
const { initDataParams } = useDataParams()

const initDatatable = () => {
  initColumns()

  validateTableProps(props)

  const { source, url, filters, items, method, rowsPerPageCount, orderBy, orderDirection } = props
  initDataParams({
    source,
    url,
    filters,
    items,
    method,
    rowsPerPageCount,
    orderBy,
    orderDirection,
  })
}

onMounted(() => {
  initDatatable()
})
</script>

<template>
  <div>
    <table-layout></table-layout>
    <slot></slot>
  </div>
</template>

<style module lang="scss"></style>
