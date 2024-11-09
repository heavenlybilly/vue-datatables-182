import { Ref, ref } from 'vue'

export const useSearch = () => {
  const search: Ref<string> = ref('')

  const setSearch = (value: string) => {
    search.value = value
  }

  return {
    search,
    setSearch,
  }
}
