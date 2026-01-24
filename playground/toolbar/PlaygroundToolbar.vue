<script setup lang="ts">
import { computed, ref } from 'vue'
import { toolbarControls } from '~/toolbar-controls'
import ExpandBtn from '~/toolbar/ExpandBtn.vue'
import ReRenderBtn from '~/toolbar/ReRenderBtn.vue'
import ToolbarGroup from '~/toolbar/ToolbarGroup.vue'
import { useTableParams } from '~/toolbar/useTableParams'
import { ToolbarState } from '~/types'
import { usePersistentState } from '~/usePersistentState'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'

const toolbarState = ref<ToolbarState>('collapsed')

const { tableParams, setTableParams } = useTableParams()
const { reRender } = useTableRendering()
usePersistentState('playground-toolbar-state', { toolbarState })

const isExpanded = computed(() => {
  return toolbarState.value !== ToolbarState.COLLAPSED
})

const classObject = computed(() => ({
  expanded: toolbarState.value === ToolbarState.EXPANDED,
  fullExpanded: toolbarState.value === ToolbarState.FULL_EXPANDED,
}))

const handleReRender = (): void => {
  Logger.trigger('rendering', 're-render button click')
  reRender()
}

const handleControlInput = (payload: { name: string; value: unknown }) => {
  setTableParams({
    [payload.name]: payload.value,
  })
}
</script>

<template>
  <div
    class="playground-toolbar"
    :class="classObject"
  >
    <div class="playground-toolbar-top">
      <re-render-btn
        v-show="isExpanded"
        @click="handleReRender"
      />

      <expand-btn v-model="toolbarState" />
    </div>

    <div
      v-show="isExpanded"
      class="playground-toolbar-split"
    ></div>

    <div
      v-show="isExpanded"
      class="playground-toolbar-content"
    >
      <div
        v-for="(group, index) of toolbarControls"
        :key="index"
        class="playground-toolbar-group-wrapper"
      >
        <toolbar-group
          :group="group"
          :table-params="tableParams"
          @input="handleControlInput"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-toolbar {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100%;
  width: 62px;
  min-width: 62px;
  max-width: 62px;

  &.expanded {
    width: 400px;
    min-width: 400px;
    max-width: 400px;
  }

  &.fullExpanded {
    width: 800px;
    min-width: 800px;
    max-width: 800px;
  }
}

.playground-toolbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.playground-toolbar-expand-btn {
  position: absolute;
  top: 30px;
  right: 15px;
}

.playground-toolbar-split {
  margin: 15px 0;
  height: 1px;
  min-height: 1px;
  max-height: 1px;
  background-color: #dedef4;
}

.playground-toolbar-content {
  flex: 1 1 auto;
  overflow-y: auto;
}

.playground-toolbar-group-wrapper {
  & + & {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f3f3fb;
  }
}
</style>
