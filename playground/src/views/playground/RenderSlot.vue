<script lang="ts">
import { PropType, defineComponent } from 'vue'
// eslint-disable-next-line import/no-unresolved
import { NormalizedScopedSlot } from 'vue/types/vnode'

export default defineComponent({
  name: 'DtCell',
  props: {
    template: {
      type: Function as PropType<NormalizedScopedSlot>,
      required: false,
      default: null,
    },
  },
  render(createElement) {
    // @ts-ignore
    return createElement(
      'div',
      // @ts-ignore
      {  },
      // @ts-ignore
      this.template({ ...this.row }),
    )
  },
})
</script>
