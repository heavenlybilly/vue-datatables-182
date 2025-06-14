// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'

/**
 * Columns
 */
export const DTTextAlign = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const
export type DTTextAlign = (typeof DTTextAlign)[keyof typeof DTTextAlign]

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
export const DTSource = {
  LOCAL: 'local',
  REMOTE: 'remote',
} as const
export type DTSource = (typeof DTSource)[keyof typeof DTSource]

export const DTMethod = {
  GET: 'GET',
  POST: 'POST',
} as const
export type DTMethod = (typeof DTMethod)[keyof typeof DTMethod]

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
export const DTOrderDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const
export type DTOrderDirection = (typeof DTOrderDirection)[keyof typeof DTOrderDirection]

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
