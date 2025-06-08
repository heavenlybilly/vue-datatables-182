import { DTOrderDirection, DTTextAlign } from '@/types/types'

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
  items: TableItem[]
  paginationEnabled: boolean
  rowPerPageOptionsRaw: string
  rowsPerPage: number
  orderBy: string | null
  orderDirection: DTOrderDirection
  searching: boolean
  rowSelection: boolean
  actions: boolean
  numbering: boolean
  rowsClickable: boolean
  scrollX: boolean
  fixedColumnsStart: number
  fixedColumnsEnd: number
}
