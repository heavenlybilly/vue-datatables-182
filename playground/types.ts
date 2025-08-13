import { DTMethod, DTOrderDirection, DTTextAlign } from '@/types'

export const ToolbarState = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded',
  FULL_EXPANDED: 'full_expanded',
} as const
export type ToolbarState = (typeof ToolbarState)[keyof typeof ToolbarState]

export type TableItem = Record<string, any>

export type FieldDef = {
  fieldName: string
  title: string
  display: boolean
  searchable: boolean
  orderable: boolean
  width?: string
  textAlign?: DTTextAlign
  cellSlot?: string
}

export type ToolbarTableParams = {
  url: string | null
  method: DTMethod
  items: TableItem[]
  paginationEnabled: boolean
  rowPerPageOptionsRaw: string
  rowsPerPage: number
  showRangeInfo: boolean
  orderBy: string | null
  orderDirection: DTOrderDirection
  searching: boolean
  actions: boolean
  numbering: boolean
  rowSelection: boolean
  rowsClickable: boolean
  selectOnRowClick: boolean
  scrollX: boolean
  fixedColumnsStart: number
  fixedColumnsEnd: number
}
