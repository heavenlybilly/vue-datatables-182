<script lang="ts">
import { PropType, defineComponent, h } from 'vue'
import { ColumnCellSlot } from '@/components/columns/types'
import { RowItem } from '@/components/types'

export default defineComponent({
  name: 'BodyCellSlot',
  props: {
    cellSlot: {
      type: Function as PropType<ColumnCellSlot<RowItem>>,
      default: null,
    },
    item: {
      type: Object as PropType<RowItem>,
      default: null,
    },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'dt182-cell-slot' },
        props.cellSlot ? props.cellSlot({ item: props.item }) : undefined,
      )
  },
})
</script>
