type ValueOf<T> = T[keyof T]

export const DTTextAlign = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right',
} as const
export type DTTextAlign = ValueOf<typeof DTTextAlign>

export const DTSource = {
  LOCAL: 'local',
  REMOTE: 'remote',
} as const
export type DTSource = ValueOf<typeof DTSource>

export const DTMethod = {
  GET: 'GET',
  POST: 'POST',
} as const
export type DTMethod = ValueOf<typeof DTMethod>

export const DTOrderDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const
export type DTOrderDirection = ValueOf<typeof DTOrderDirection>
