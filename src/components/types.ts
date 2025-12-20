import type { VNode } from 'vue'

export * from '../types'

export type ValueOf<T> = T[keyof T]

export type Branded<Type, Brand> = Type & {
  readonly __brand: Brand
}

export type SlotResult = VNode | VNode[] | null | undefined

export type SlotFn<Props = any> = (props?: Props) => SlotResult

export type Slots = {
  default?: SlotFn
  [name: string]: SlotFn | undefined
}
