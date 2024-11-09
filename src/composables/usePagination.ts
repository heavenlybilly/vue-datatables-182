import { Ref, ref } from 'vue'

export const usePagination = () => {
  const page: Ref<number> = ref(1)
  const rowsPerPage: Ref<number> = ref(0)

  const setPage = (value: number) => {
    page.value = value
  }

  const setRowsPerPage = (value: number) => {
    rowsPerPage.value = value
  }

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  }
}
