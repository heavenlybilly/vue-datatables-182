<script setup lang="ts">
import type { DataTableColumnProps, DataTableColumnSlots } from '../types'

defineOptions({
  name: 'DataTableColumn',
  render: () => null,
})

defineProps<DataTableColumnProps>()

defineSlots<DataTableColumnSlots>()
</script>
