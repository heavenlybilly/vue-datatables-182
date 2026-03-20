import { books } from '~/mocks/mocks'
import { SortDirection, Source } from '@/components/types'

export type Preset = {
  name: string
  description: string
  values: Record<string, unknown>
}

const defaultItems = JSON.stringify(books, null, 2)

const remoteRequestAdapter = `function(ctx) {
  return {
    url: ctx.url,
    requestBody: ctx.requestBody
  }
}`

const remoteResponseAdapter = `function(response) {
  return {
    items: response.data,
    total: response.total,
    filtered: response.filtered
  }
}`

const baseValues: Record<string, unknown> = {
  source: Source.LOCAL,
  url: undefined,
  filter: undefined,
  items: defaultItems,
  requestAdapter: undefined,
  responseAdapter: undefined,
  pagination: false,
  rowsPerPageCount: 10,
  rowsPerPageOptions: '10, 20, 25, 50',
  search: false,
  sortBy: undefined,
  sortDirection: undefined,
  rowKey: 'id',
  selection: false,
  allowSelectAll: false,
  selectionLimit: undefined,
  rowsClickable: false,
  selectOnRowClick: false,
  showPageDetails: false,
  scrollX: false,
  stickyHeader: false,
  verticalBorders: false,
  striped: false,
  numbering: false,
}

export const presets: Preset[] = [
  {
    name: 'Local Basic',
    description: 'Локальные данные, пагинация, поиск',
    values: {
      ...baseValues,
      pagination: true,
      search: true,
      showPageDetails: true,
    },
  },
  {
    name: 'Remote API',
    description: 'Удалённый источник через mock-сервер',
    values: {
      ...baseValues,
      source: Source.REMOTE,
      url: '/api/books',
      items: undefined,
      requestAdapter: remoteRequestAdapter,
      responseAdapter: remoteResponseAdapter,
      pagination: true,
      search: true,
      showPageDetails: true,
    },
  },
  {
    name: 'Selection Mode',
    description: 'Выбор строк, allowSelectAll, кликабельные строки',
    values: {
      ...baseValues,
      pagination: true,
      showPageDetails: true,
      selection: true,
      allowSelectAll: true,
      rowsClickable: true,
      selectOnRowClick: true,
      numbering: true,
    },
  },
  {
    name: 'Sorted & Paginated',
    description: 'Сортировка по цене, пагинация по 5',
    values: {
      ...baseValues,
      pagination: true,
      rowsPerPageCount: 5,
      rowsPerPageOptions: '5, 10, 15',
      search: true,
      sortBy: 'price',
      sortDirection: SortDirection.ASC,
      showPageDetails: true,
      striped: true,
      numbering: true,
    },
  },
  {
    name: 'Minimal',
    description: 'Только данные, без фич',
    values: {
      ...baseValues,
    },
  },
  {
    name: 'Full Featured',
    description: 'Все фичи включены',
    values: {
      ...baseValues,
      pagination: true,
      search: true,
      sortBy: 'title',
      sortDirection: SortDirection.ASC,
      selection: true,
      allowSelectAll: true,
      rowsClickable: true,
      selectOnRowClick: true,
      showPageDetails: true,
      scrollX: true,
      stickyHeader: true,
      verticalBorders: true,
      striped: true,
      numbering: true,
    },
  },
]
