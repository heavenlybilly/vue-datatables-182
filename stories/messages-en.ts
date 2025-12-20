import { defaultMessages } from '../src'
import type { TableMessages } from '../src'

export const englishMessages: Readonly<TableMessages> = {
  ...defaultMessages,
  tableLabel: 'Records',
  search: 'Search',
  searchPlaceholder: 'Search records',
  clearSearch: 'Clear search',
  rowsPerPage: 'Rows per page',
  pagination: 'Pagination',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  page: (page) => `Page ${page}`,
  sort: (title) => `Sort by ${title}`,
  selectAll: 'Select all visible rows',
  selectRow: (number) => `Select row ${number}`,
  activateRow: (number) => `Open row ${number}`,
  numbering: 'Row number',
  selection: 'Row selection',
  loading: 'Loading…',
  empty: 'No records.',
  noResults: 'No matching records.',
  error: 'Could not load records.',
  retry: 'Retry',
  pageDetails: ({ start, end, filtered, total }) =>
    `${start}–${end} of ${filtered}${total === filtered ? '' : ` (${total} total)`}`,
}
