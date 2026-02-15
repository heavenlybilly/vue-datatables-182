<script setup lang="ts">
import { ref } from 'vue'

import PlaygroundHeader from '~/core/header/PlaygroundHeader.vue'
import { useHeader } from '~/core/header/useHeader'
import PlaygroundParams from '~/core/params/PlaygroundParams.vue'
import PlaygroundTable from '~/core/table/PlaygroundTable.vue'
import { useDraggableResizable } from '~/useDraggableResizable'

const { headerStyleObject, bodyStyleObject, tableStyleObject, showTableParams } = useHeader()

const paramsRef = ref<HTMLElement | null>(null)

const { style: paramsStyle } = useDraggableResizable(paramsRef, {
  dragHandleSelector: '.playground-toolbar-top',
  storageKey: 'playground-params-geometry',
  defaults: {
    top: 0,
    left: window.innerWidth - 400,
    width: 400,
    height: window.innerHeight,
  },
})
</script>

<template>
  <div
    class="playground-wrapper"
    :style="bodyStyleObject"
  >
    <div
      class="playground-header"
      :style="headerStyleObject"
    >
      <playground-header />
    </div>

    <div
      class="playground-table"
      :style="tableStyleObject"
    >
      <playground-table />
    </div>

    <div
      v-if="showTableParams"
      ref="paramsRef"
      class="playground-params"
      :style="paramsStyle"
    >
      <playground-params />
    </div>
  </div>
</template>

<style lang="scss">
.playground-wrapper {
  padding: 10px 30px 30px 30px;
  overflow: hidden;
}

.playground-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 1000;
}

.playground-table {
  margin-top: 60px;
}

.playground-params {
  z-index: 1001;
  background-color: #fff;
  padding: 20px;
  border-radius: 6px;
  box-shadow:
    0 2px 12px rgba(72, 72, 202, 0.1),
    0 0 0 1px rgba(72, 72, 202, 0.08);
}
</style>
