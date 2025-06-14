import { DTOrderDirection, DTRowItem } from '@/types'

export default (items: DTRowItem[], orderBy: string, orderDirection: DTOrderDirection) => {
  return items.sort((a, b) => {
    const valueA = a[orderBy]
    const valueB = b[orderBy]

    if (valueA === null) return 1
    if (valueB === null) return -1

    if (valueA === valueB) {
      return 0
    }

    if (orderDirection === 'asc') {
      return valueA > valueB ? 1 : -1
    }
    return valueA < valueB ? 1 : -1
  })
}
