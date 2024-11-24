import { Ref, computed, ref } from 'vue'
import { DTTableData } from '@/types/types'

export const useRowSelection = (tableData: Ref<DTTableData | null>) => {
  const selectedRowIndexes: Ref<number[]> = ref([])

  const selectedRows = computed(() => {
    if (!tableData.value) {
      return []
    }

    return tableData.value.rows.filter((row) => selectedRowIndexes.value.includes(row.index))
  })

  const isSelectedAll = computed(() => {
    if (!tableData.value) {
      return false
    }

    return (
      selectedRowIndexes.value.length === tableData.value.rows.length &&
      !!selectedRowIndexes.value.length
    )
  })

  const selectRow = (index: number) => {
    if (!tableData.value) {
      return
    }

    selectedRowIndexes.value.push(
      ...tableData.value.rows.filter((row) => row.index === index).map((row) => row.index),
    )
  }

  const deselectRow = (value: number) => {
    if (!tableData.value) {
      return
    }

    selectedRowIndexes.value = selectedRowIndexes.value.filter((index) => index !== value)
  }

  const selectAll = () => {
    if (!tableData.value) {
      return
    }

    selectedRowIndexes.value = tableData.value.rows.map((row) => row.index)
  }

  const clearSelection = () => {
    selectedRowIndexes.value = []
  }

  return {
    selectedRowIndexes,
    selectedRows,
    isSelectedAll,
    selectRow,
    deselectRow,
    selectAll,
    clearSelection,
  }
}
