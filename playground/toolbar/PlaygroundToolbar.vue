<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePersistentState } from '~/composables/usePersistentState'
import { useTableRendering } from '~/composables/useTableRendering'
import { useTableSource } from '~/composables/useTableSource'
import ExpandBtn from '~/toolbar/ExpandBtn.vue'
import ReRenderBtn from '~/toolbar/ReRenderBtn.vue'
import FieldsGroup from '~/toolbar/groups/FieldsGroup.vue'
import FixedColumnsGroup from '~/toolbar/groups/FixedColumnsGroup.vue'
import ItemsGroup from '~/toolbar/groups/ItemsGroup.vue'
import OtherParamsGroup from '~/toolbar/groups/OtherParamsGroup.vue'
import PaginationGroup from '~/toolbar/groups/PaginationGroup.vue'
import SortGroup from '~/toolbar/groups/SortGroup.vue'
import SourceGroup from '~/toolbar/groups/SourceGroup.vue'
import UrlGroup from '~/toolbar/groups/UrlGroup.vue'
import { ToolbarState } from '~/types'
import { Logger } from '~/utils/logger'
import { DTSource } from '@/types/types'

const toolbarState = ref<ToolbarState>('collapsed')

const { source } = useTableSource()
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
      <div class="playground-toolbar-group">
        <source-group />
      </div>

      <div
        v-show="source === DTSource.LOCAL"
        class="playground-toolbar-group"
      >
        <items-group />
      </div>

      <div
        v-show="source === DTSource.REMOTE"
        class="playground-toolbar-group"
      >
        <url-group />
      </div>

      <div class="playground-toolbar-group">
        <fields-group />
      </div>

      <div class="playground-toolbar-group">
        <other-params-group />
      </div>

      <div class="playground-toolbar-group">
        <pagination-group />
      </div>

      <div class="playground-toolbar-group">
        <fixed-columns-group />
      </div>

      <div class="playground-toolbar-group">
        <sort-group />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-toolbar {
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 30px 15px;
  border-radius: 10px;
  background-color: #fff;
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

.playground-toolbar-group {
  & + & {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f3f3fb;
  }
}
</style>
