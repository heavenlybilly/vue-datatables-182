export type PageDetailsContext = {
  start: number
  end: number
  filtered: number
  total: number
}

export type TableMessages = {
  tableLabel: string
  search: string
  searchPlaceholder: string
  clearSearch: string
  rowsPerPage: string
  pagination: string
  firstPage: string
  previousPage: string
  nextPage: string
  lastPage: string
  page: (page: number) => string
  sort: (title: string) => string
  selectAll: string
  selectRow: (number: number) => string
  activateRow: (number: number) => string
  numbering: string
  selection: string
  loading: string
  empty: string
  noResults: string
  error: string
  retry: string
  pageDetails: (context: PageDetailsContext) => string
}
