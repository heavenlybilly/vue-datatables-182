<script lang="ts">
import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import type { CellSlotProps, RowItem } from '../../../../types'
import type { ColumnCellSlot } from '../../../columns/types'

export default defineComponent({
  name: 'BodyCellSlot',
  props: {
    cellSlot: {
      type: Function as PropType<ColumnCellSlot<RowItem>>,
      required: true,
    },
    scope: {
      type: Object as PropType<CellSlotProps>,
      required: true,
    },
  },
  setup: (props) => () =>
    h(
      'div',
      {
        class: 'dt182-cell-slot',
      },
      props.cellSlot(props.scope),
    ),
})
</script>
