import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DataTableProps } from '../../types'
import type { ColumnRegistry } from './types'

export default defineComponent({
  name: 'ColumnObserver',
  props: {
    registry: {
      type: Object as PropType<ColumnRegistry>,
      required: true,
    },
    tableProps: {
      type: Object as PropType<DataTableProps>,
      required: true,
    },
  },
  emits: ['ready'],
  setup(props, { slots, emit }) {
    let ready = false

    return () => {
      props.registry.rebuild({
        slots,
        tableProps: props.tableProps,
      })

      if (!ready) {
        ready = true
        emit('ready')
      }

      return null
    }
  },
})
