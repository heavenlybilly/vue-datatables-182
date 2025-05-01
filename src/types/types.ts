// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'

/**
 * Columns
 */
export type DTTextAlign = 'center' | 'left' | 'right'

type DTColumnParams = {
  readonly field: string
  readonly title: string | null
  readonly orderable: boolean
  readonly searchable: boolean
  readonly classObject: Record<string, boolean>
  readonly width: string | undefined
  readonly textAlign: DTTextAlign | undefined
}
type DTColumnSlots = {
  readonly cell: NormalizedScopedSlot | undefined
  readonly filter: NormalizedScopedSlot | undefined
}

export type DTColumn = {
  readonly index: number
  readonly params: DTColumnParams
  readonly slots: DTColumnSlots
}

/**
 * Table data
 */
export type DTSource = 'remote' | 'local'
export type DTMethod = 'GET' | 'POST'

// todo: кажется, тут есть две группы: того, что приходит с бэка и уже обработанных данных
export type DTRowItemValue = string | number | boolean | null
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

export type DTFilter = {
  [key: string]: any
}

/**
 * Plugin
 */
export type DTPluginOptions = {
  readonly registerGlobally: boolean
  readonly csrfToken?: string
  readonly defaultMethod: DTMethod
}
