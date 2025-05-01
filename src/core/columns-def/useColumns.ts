import Vue, { getCurrentInstance, ref } from 'vue'
// eslint-disable-next-line import/no-unresolved
import { VNode } from 'vue/types/vnode'
import { DTColumn } from '@/types/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { resolveClassObject } from '@/core/columns-def/class-resolver'
import { extractProps } from '@/core/columns-def/props-extractor'

export const useColumns = () => {
  const columns = ref<DTColumn[]>([])

  const initColumns = () => {
    const instance = getCurrentInstance() as { proxy: Vue }

    if (!instance || !instance.proxy) {
      throw new VueDatatables182Error('Error on getting component instance')
    }

    const { proxy } = instance

    const defaultSlot = proxy.$scopedSlots.default
    const nodes: VNode[] = defaultSlot ? (defaultSlot({}) as VNode[]) : []

    let index = 0
    columns.value = nodes.reduce((carry: DTColumn[], node) => {
      if (!node.tag || !node.componentOptions?.propsData) {
        return carry
      }

      const column: DTColumn = {
        index,
        params: {
          ...extractProps(node.componentOptions.propsData),
          classObject: resolveClassObject(node?.data?.staticClass),
        },
        slots: {
          filter: node.componentInstance?.$scopedSlots.filter,
          cell: node.componentInstance?.$scopedSlots.cell,
        },
      }

      index += 1

      return [...carry, column]
    }, [])

    if (!columns.value.length) {
      throw new VueDatatables182Error('Columns not found')
    }
  }

  return { columns, initColumns }
}
