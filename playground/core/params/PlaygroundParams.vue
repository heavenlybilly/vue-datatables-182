<script setup lang="ts">
import { ref } from 'vue'
import { useHeader } from '~/core/header/useHeader'
import ColumnsTab from '~/core/params/tabs/ColumnsTab.vue'
import EventsTab from '~/core/params/tabs/EventsTab.vue'
import PropsTab from '~/core/params/tabs/PropsTab.vue'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'

type Tab = 'props' | 'columns' | 'events'

const { setShowTableParams } = useHeader()
const { reRender } = useTableRendering()

const activeTab = ref<Tab>('props')

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'props', label: 'Props', icon: 'M12 3v18M3 12h18M6 6l12 12M18 6L6 18' },
  { id: 'columns', label: 'Columns', icon: 'M9 3v18M15 3v18M3 9h18M3 15h18' },
  { id: 'events', label: 'Events', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8' },
]

const handleClose = (): void => {
  setShowTableParams(false)
}

const handleReRender = (): void => {
  Logger.trigger('rendering', 're-render button click')
  reRender()
}
</script>

<template>
  <div class="playground-toolbar">
    <div class="playground-toolbar-top">
      <div class="playground-toolbar-top-left">
        <button
          class="playground-toolbar-btn playground-toolbar-btn--accent"
          title="Re-render table"
          @click="handleReRender"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>

        <div class="playground-toolbar-tabs">
          <button
            v-for="tab of tabs"
            :key="tab.id"
            class="playground-toolbar-tab"
            :class="{ active: activeTab === tab.id }"
            :title="tab.label"
            @click="activeTab = tab.id"
          >
            <span class="playground-toolbar-tab-label">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <button
        class="playground-toolbar-btn"
        title="Close panel"
        @click="handleClose"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
          />
        </svg>
      </button>
    </div>

    <div class="playground-toolbar-content">
      <props-tab v-if="activeTab === 'props'" />
      <columns-tab v-if="activeTab === 'columns'" />
      <events-tab v-if="activeTab === 'events'" />
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
  background-color: var(--pg-bg-secondary);
  backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  -webkit-backdrop-filter: saturate(180%) blur(var(--pg-panel-blur));
  z-index: 1;
  padding: 8px 10px;
  border-bottom: 1px solid var(--pg-border);
  cursor: grab;
  gap: 6px;
  flex-shrink: 0;
}

.playground-toolbar-top-left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.playground-toolbar-tabs {
  display: flex;
  gap: 1px;
  background: var(--pg-bg-tertiary);
  border-radius: 8px;
  padding: 2px;
  min-width: 0;
  flex: 1;
}

.playground-toolbar-tab {
  flex: 1;
  min-width: 0;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--pg-text-muted);
  cursor: pointer;
  transition: all 150ms;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: var(--pg-text-secondary);
  }

  &.active {
    background: var(--pg-panel-bg);
    color: var(--pg-text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
}

.playground-toolbar-tab-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playground-toolbar-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 150ms;
  color: var(--pg-text-muted);
  border: 1px solid transparent;
  background: var(--pg-bg-tertiary);
  flex-shrink: 0;

  &:hover {
    color: var(--pg-text-primary);
    background: var(--pg-border);
  }

  &--accent {
    color: var(--pg-accent);
    background: var(--pg-accent-bg);

    &:hover {
      background: var(--pg-accent);
      color: #fff;
    }
  }
}

.playground-toolbar-content {
  flex: 1 1 auto;
  padding: 16px;
  overflow-y: auto;
}
</style>
