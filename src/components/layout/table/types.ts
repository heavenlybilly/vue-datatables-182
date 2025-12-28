import { ValueOf } from '@/components/types'

export const CheckboxState = {
  CHECKED: 'checked',
  INDETERMINATE: 'indeterminate',
  UNCHECKED: 'unchecked',
} as const
export type CheckboxState = ValueOf<typeof CheckboxState>
