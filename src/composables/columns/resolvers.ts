// eslint-disable-next-line import/no-unresolved
import { VNode } from 'vue/types/vnode'

export const resolveBooleanProp = (value: any): boolean => value !== undefined && value !== false

export const resolveClassObject = (node: VNode): Record<string, boolean> => {
  const classList = node.data?.staticClass?.split(' ') ?? []
  return classList.reduce(
    (classObjectCarry: Record<string, boolean>, className: string) => ({
      ...classObjectCarry,
      [className]: true,
    }),
    {},
  )
}
