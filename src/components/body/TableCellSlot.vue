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
    styleObject: {
      type: Object,
      required: true,
    },
  },
  render(createElement) {
    // @ts-ignore
    return createElement(
      'td',
      // @ts-ignore
      { class: 'dt182-cell', style: this.styleObject },
      // @ts-ignore
      this.template({ ...this.row }),
    )
  },
})
</script>
