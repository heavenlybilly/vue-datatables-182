import Vue, { Ref, ref } from 'vue'
// eslint-disable-next-line import/no-unresolved
import { VNode } from 'vue/types/vnode'
import { DTColumn, DTColumnProps, DTTextAlign } from '@/types/types'

const resolveBooleanProp = (value: any): boolean => value !== undefined && value !== false

const resolveClassObject = (node: VNode): Record<string, boolean> => {
  const classList = node.data?.staticClass?.split(' ') ?? []
  return classList.reduce(
    (classObjectCarry: Record<string, boolean>, className: string) => ({
      ...classObjectCarry,
      [className]: true,
    }),
    {},
  )
}

const resolveStyleObject = (params: { width?: string; textAlign?: DTTextAlign }) => {
  const styleObject: {
    width?: string
    minWidth?: string
    maxWidth?: string
    textAlign: DTTextAlign
  } = {
    textAlign: params.textAlign ?? 'left',
  }

  if (params.width) {
    styleObject.width = params.width
    styleObject.minWidth = params.width
    styleObject.maxWidth = params.width
  }

  return styleObject
}

export const useColumns = () => {
  const columns: Ref<DTColumn[]> = ref([])

  const initColumns = (proxy: Vue) => {
    const defaultSlot = proxy.$scopedSlots.default
    const nodes: VNode[] = defaultSlot ? (defaultSlot({}) as VNode[]) : []

    let index = 0
    columns.value = nodes.reduce((carry: DTColumn[], node) => {
      if (!node.tag || !node.componentOptions?.propsData) {
        return carry
      }

      const props = node.componentOptions.propsData as DTColumnProps
      const { field, title, orderable, searchable, width, textAlign } = props

      const column: DTColumn = {
        index,
        params: {
          field,
          title: title ?? null,
          orderable: resolveBooleanProp(orderable),
          searchable: resolveBooleanProp(searchable),
        },
        slots: {
          filter: node.componentInstance?.$scopedSlots.filter,
          cell: node.componentInstance?.$scopedSlots.cell,
        },
        appearance: {
          classObject: resolveClassObject(node),
          styleObject: resolveStyleObject({ width, textAlign }),
        },
      }

      index += 1

      return [...carry, column]
    }, [])

    if (!columns.value.length) {
      throw new Error('Columns not found')
    }
  }

  return { columns, initColumns }
}
