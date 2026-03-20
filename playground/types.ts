type ValueOf<T> = T[keyof T]

export const ToolbarState = {
  COLLAPSED: 'collapsed',
  EXPANDED: 'expanded',
  FULL_EXPANDED: 'full_expanded',
} as const
export type ToolbarState = ValueOf<typeof ToolbarState>

export type TableItem = Record<string, any>

export type FieldDef = {
  fieldName: string
  title: string
  display: boolean
  searchable: boolean
  orderable: boolean
  width?: string
  textAlign?: string
  cellSlot?: string
}

/**
 * Toolbar
 */
export const ControlType = {
  STRING: 'string',
  NUMBER: 'number',
  SWITCHER: 'switcher',
  CODE: 'code',
  SELECT: 'select',
} as const
export type ControlType = ValueOf<typeof ControlType>

type ControlParamsMap = {
  [ControlType.STRING]: {
    defaultValue?: string
    normalizer?: (value?: string) => unknown
  }
  [ControlType.NUMBER]: {
    defaultValue?: number
    normalizer?: (value?: string) => unknown
  }
  [ControlType.SWITCHER]: {
    defaultValue?: boolean
    normalizer?: (value?: boolean) => unknown
  }
  [ControlType.CODE]: {
    defaultValue?: string
    normalizer?: (value?: string) => unknown
  }
  [ControlType.SELECT]: {
    defaultValue?: string
    normalizer?: (value?: string) => unknown
  }
}

type ControlPropsMap = {
  [ControlType.STRING]: Record<string, never>
  [ControlType.NUMBER]: Record<string, never>
  [ControlType.SWITCHER]: Record<string, never>
  [ControlType.CODE]: Record<string, never>
  [ControlType.SELECT]: {
    options: string[]
  }
}

export type ToolbarControl<Type extends ControlType = ControlType> = {
  type: Type
  name: string
  description?: string
  params?: ControlParamsMap[Type]
  props?: ControlPropsMap[Type]
  required?: boolean
  hidden?: boolean
}

export type ToolbarGroup = {
  title: string
  controls: ToolbarControl[]
}
