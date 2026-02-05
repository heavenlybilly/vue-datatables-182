<script setup lang="ts">
import ReRenderBtn from '~/core/params/ReRenderBtn.vue'
import ToolbarGroup from '~/core/params/ToolbarGroup.vue'
import { useTableParams } from '~/core/params/useTableParams'
import { toolbarControls } from '~/toolbar-controls'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'

const { tableParams, setTableParams } = useTableParams()
const { reRender } = useTableRendering()

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
  <div class="playground-toolbar">
    <div class="playground-toolbar-top">
      <re-render-btn @click="handleReRender" />

      <div class="playground-toolbar-split"></div>
    </div>

    <div class="playground-toolbar-content">
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
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.playground-toolbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  padding-bottom: 20px;

  .playground-toolbar-split {
    margin: 15px 0;
    height: 1px;
    min-height: 1px;
    max-height: 1px;
    background-color: #dedef4;
  }
}

.playground-toolbar-expand-btn {
  position: absolute;
  top: 30px;
  right: 15px;
}

.playground-toolbar-content {
  flex: 1 1 auto;
}

.playground-toolbar-group-wrapper {
  & + & {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f3f3fb;
  }
}
</style>
