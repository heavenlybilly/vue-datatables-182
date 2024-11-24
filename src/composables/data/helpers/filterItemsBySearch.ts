import { DTRowItem } from '@/types/types'

export default function filterItemsBySearch(
  items: DTRowItem[],
  search: string,
  searchableColumnNames: string[],
) {
  if (!search || !searchableColumnNames.length) {
    return items
  }

  return items.filter((item) => {
    return searchableColumnNames.reduce((carry: boolean, columnName: string) => {
      const value = item[columnName]

      if (!value) {
        return false
      }

      return carry || `${item[columnName]}`.toLowerCase().includes(search.toLowerCase())
    }, false)
  })
}
