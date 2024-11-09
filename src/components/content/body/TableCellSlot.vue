<script lang="ts">
import { PropType, defineComponent } from 'vue'
// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'
import { DTRow } from '@/types'

export default defineComponent({
  name: 'DtCell',
  props: {
    template: {
      type: Function as PropType<NormalizedScopedSlot>,
      required: false,
      default: null,
    },
    row: {
      type: Object as PropType<DTRow>,
      required: false,
      default: null,
    },
  },
  render(createElement) {
    // @ts-ignore
    return createElement('td', { class: 'data-table-td' }, this.template({ row: this.row }))
  },
})
</script>
