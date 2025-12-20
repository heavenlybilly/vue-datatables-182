import { defineComponent, h, resolveComponent } from 'vue'
import { Source } from '../../src/types'

export default defineComponent({
  setup: () => () =>
    h(
      resolveComponent('DataTable'),
      {
        rowKey: 'id',
        source: Source.LOCAL,
        items: [{ id: 1, name: 'Anna' }],
      },
      { default: () => h(resolveComponent('DataTableColumn'), { field: 'name' }) },
    ),
})
