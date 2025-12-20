import { useContext } from '@/composables/useContext'
import { ref } from 'vue'
import { DTColumn } from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { contextKey } from './context-key'
import { extractColumnNodes } from './logic/extract-column-nodes'
import { extractProps } from './logic/extract-prop-value'
import { resolveClassObject } from './logic/resolve-class-object'

export const useColumnsSchema = () => {
  const { provideContext } = useContext(contextKey)

  const columns = ref<DTColumn[]>([])

  const initColumns = () => {
    const nodes = extractColumnNodes()

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
      throw new VueDatatables182Error('columns not found')
    }
  }

  provideContext({ columns })

  return { columns, initColumns }
}
