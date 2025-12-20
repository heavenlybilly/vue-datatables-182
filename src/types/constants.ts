type ValueOf<T> = T[keyof T]

export const TextAlign = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const

export type TextAlign = ValueOf<typeof TextAlign>

export const Source = {
  LOCAL: 'local',
  REMOTE: 'remote',
} as const

export type Source = ValueOf<typeof Source>

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = ValueOf<typeof SortDirection>

export const Sticky = {
  LEFT: 'left',
  RIGHT: 'right',
} as const

export type Sticky = ValueOf<typeof Sticky>
