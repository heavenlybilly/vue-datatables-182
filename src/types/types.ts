// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { DTMethod, DTOrderDirection, DTTextAlign } from './enums'

/**
 * Columns
 */
type DTColumnParams = {
  readonly field: string
  readonly title: string | null
  readonly orderable: boolean
  readonly searchable: boolean
  readonly classObject: Record<string, boolean>
  readonly width?: string
  readonly textAlign?: DTTextAlign
}
type DTColumnSlots = {
  readonly cell?: NormalizedScopedSlot
  readonly filter?: NormalizedScopedSlot
}

export type DTColumn = {
  readonly index: number
  readonly params: DTColumnParams
  readonly slots: DTColumnSlots
}

/**
 * Table data
 */
export type DTRowItemValue = any
export type DTRowItem = Record<string, DTRowItemValue>
export type DTRow<T = DTRowItem> = {
  readonly index: number
  readonly number: number
  readonly item: T
}

export type DTTableData<T = DTRowItem> = {
  readonly total: number
  readonly filtered: number
  readonly rows: DTRow<T>[]
}

export type DTServerResponse = {
  readonly draw: number
  readonly recordsTotal: number
  readonly recordsFiltered: number
  readonly data: DTRowItem[]
  readonly queries?: {
    readonly query: string
    readonly time: number
    readonly bindings: unknown[]
  }[]
  readonly error?: string
  // todo: input
}

/**
 * Order
 */
export type DTOrderColumn = {
  readonly column: string
  readonly direction: DTOrderDirection
}
export type DTOrder = DTOrderColumn

/**
 * Error
 */
export type DTError = {
  readonly message: string
  readonly description?: string | null
}

export type DTFilter<T = any> = Record<string, T>

/**
 * Plugin
 */
export type DTPluginOptions = {
  readonly registerGlobally?: boolean
  readonly csrfToken?: string
  readonly defaultMethod?: DTMethod
}
