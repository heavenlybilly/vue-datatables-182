// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'

/**
 * Columns
 */
export type DTTextAlign = 'center' | 'left' | 'right'

export type DTColumnProps = {
  readonly field: string
  readonly title: string
  readonly orderable: boolean
  readonly searchable: boolean
  readonly width: string | undefined
  readonly textAlign: DTTextAlign | undefined
}

type DTColumnParams = {
  readonly field: string
  readonly title: string | null
  readonly orderable: boolean
  readonly searchable: boolean
}
type DTColumnSlots = {
  readonly cell: NormalizedScopedSlot | undefined
  readonly filter: NormalizedScopedSlot | undefined
}
type DTColumnAppearance = {
  readonly styleObject: Record<string, string | number>
  readonly classObject: Record<string, boolean>
}

export type DTColumn = {
  readonly index: number
  readonly params: DTColumnParams
  readonly slots: DTColumnSlots
  readonly appearance: DTColumnAppearance
}

/**
 * Table data
 */
export type DTSource = 'server' | 'client'

export type DTRowItemValue = string | number | boolean | null
export type DTRowItem = Record<string, DTRowItemValue>
export type DTRow = {
  readonly index: number
  readonly number: number
  readonly item: DTRowItem
}

export type DTTableData = {
  readonly total: number
  readonly filtered: number
  readonly rows: DTRow[]
}

/**
 * Order
 */
export type DTOrderDirection = 'asc' | 'desc'
export type DTOrderColumn = {
  readonly column: string
  readonly direction: DTOrderDirection
}
export type DTOrder = DTOrderColumn

/**
 * Error
 */
export type DTError = {
  message: string
  description?: string | null
}
