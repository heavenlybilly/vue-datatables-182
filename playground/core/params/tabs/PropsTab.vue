<script setup lang="ts">
import ToolbarGroup from '~/core/params/ToolbarGroup.vue'
import { useTableParams } from '~/core/params/useTableParams'
import { toolbarControls } from '~/toolbar-controls'

const { tableParams, setTableParams } = useTableParams()

const handleControlInput = (payload: { name: string; value: unknown }) => {
  setTableParams({
    [payload.name]: payload.value,
  })
}
</script>

<template>
  <div class="props-tab">
    <div
      v-for="(group, index) of toolbarControls"
      :key="index"
      class="props-tab-group"
    >
      <toolbar-group
        :group="group"
        :table-params="tableParams"
        @input="handleControlInput"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.props-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.props-tab-group {
  & + & {
    padding-top: 16px;
    border-top: 1px solid var(--pg-border);
  }
}
</style>
