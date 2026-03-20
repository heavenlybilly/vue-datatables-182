<script setup lang="ts">
import { ref, watch } from 'vue'
import PlaygroundHeader from '~/core/header/PlaygroundHeader.vue'
import { useHeader } from '~/core/header/useHeader'
import PlaygroundParams from '~/core/params/PlaygroundParams.vue'
import PlaygroundTable from '~/core/table/PlaygroundTable.vue'
import { useDraggableResizable } from '~/useDraggableResizable'

const { showTableParams, theme } = useHeader()

const paramsRef = ref<HTMLElement | null>(null)

const { style: paramsStyle } = useDraggableResizable(paramsRef, {
  dragHandleSelector: '.playground-toolbar-top',
  storageKey: 'playground-params-geometry',
  defaults: {
    top: 0,
    left: window.innerWidth - 420,
    width: 420,
    height: window.innerHeight,
  },
})

watch(
  theme,
  (value) => {
    document.documentElement.setAttribute('data-theme', value)
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="playground-wrapper"
  >
    <div class="playground-header">
      <playground-header />
    </div>

    <div
      class="playground-table"
    >
      <playground-table />
    </div>

    <transition name="panel">
      <div
        v-if="showTableParams"
        ref="paramsRef"
        class="playground-params"
        :style="paramsStyle"
      >
        <playground-params />
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.playground-wrapper {
  padding: 10px 30px 30px 30px;
  overflow: hidden;
  min-height: 100vh;
  color: var(--pg-text-secondary);
  background-color: var(--pg-bg);
  transition: background-color 200ms;
}

.playground-table {
  color: initial;
  margin-top: 62px;
}

.playground-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  z-index: 1000;
  background-color: var(--pg-header-bg);
  backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  -webkit-backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  box-shadow: var(--pg-header-shadow);
  transition:
    background-color 200ms,
    box-shadow 200ms;
}

.playground-params {
  z-index: 1001;
  background-color: var(--pg-panel-bg);
  backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  -webkit-backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  padding: 0;
  border-radius: 12px;
  box-shadow: var(--pg-panel-shadow);
  overflow: hidden;
  transition:
    background-color 200ms,
    box-shadow 200ms;
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.panel-enter,
.panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
