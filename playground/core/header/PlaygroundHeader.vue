<script setup lang="ts">
import ToggleBtn from '~/core/header/ToggleBtn.vue'
import { useHeader } from '~/core/header/useHeader'
import { presets } from '~/presets'
import { useStore } from '~/store'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'

const store = useStore()
const { reRender } = useTableRendering()

const {
  showTableParams,
  theme,
  setShowTableParams,
  toggleTheme,
} = useHeader()

const handlePresetChange = (e: Event) => {
  if (e.target instanceof HTMLSelectElement) {
    const selected = e.target.value
    const preset = presets.find((p) => p.name === selected)

    if (preset) {
      store.applyPreset(preset)
      Logger.trigger('preset', preset.name)
      reRender()
    }

    e.target.value = ''
  }
}
</script>

<template>
  <div class="playground-header">
    <div class="playground-header-left">
      <div class="playground-header-logo">DT</div>

      <div class="playground-header-sep"></div>

      <select
        class="playground-header-select"
        value=""
        @change="handlePresetChange"
      >
        <option
          disabled
          value=""
        >
          Presets
        </option>
        <option
          v-for="preset of presets"
          :key="preset.name"
          :title="preset.description"
          :value="preset.name"
        >
          {{ preset.name }}
        </option>
      </select>
    </div>

    <div class="playground-header-right">
      <button
        class="playground-header-theme-btn"
        :title="theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'"
        @click="toggleTheme"
      >
        <span
          class="playground-header-theme-icon"
          :class="{ dark: theme === 'dark' }"
        >
          <svg
            v-if="theme === 'light'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="5"
            />
            <line
              x1="12"
              y1="1"
              x2="12"
              y2="3"
            />
            <line
              x1="12"
              y1="21"
              x2="12"
              y2="23"
            />
            <line
              x1="4.22"
              y1="4.22"
              x2="5.64"
              y2="5.64"
            />
            <line
              x1="18.36"
              y1="18.36"
              x2="19.78"
              y2="19.78"
            />
            <line
              x1="1"
              y1="12"
              x2="3"
              y2="12"
            />
            <line
              x1="21"
              y1="12"
              x2="23"
              y2="12"
            />
            <line
              x1="4.22"
              y1="19.78"
              x2="5.64"
              y2="18.36"
            />
            <line
              x1="18.36"
              y1="5.64"
              x2="19.78"
              y2="4.22"
            />
          </svg>
        </span>
      </button>

      <toggle-btn
        :value="showTableParams"
        @input="(v) => setShowTableParams(v)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="4"
            y1="21"
            x2="4"
            y2="14"
          />
          <line
            x1="4"
            y1="10"
            x2="4"
            y2="3"
          />
          <line
            x1="12"
            y1="21"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="3"
          />
          <line
            x1="20"
            y1="21"
            x2="20"
            y2="16"
          />
          <line
            x1="20"
            y1="12"
            x2="20"
            y2="3"
          />
          <line
            x1="1"
            y1="14"
            x2="7"
            y2="14"
          />
          <line
            x1="9"
            y1="8"
            x2="15"
            y2="8"
          />
          <line
            x1="17"
            y1="16"
            x2="23"
            y2="16"
          />
        </svg>
        Panel
      </toggle-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-header {
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.playground-header-left,
.playground-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.playground-header-logo {
  font-weight: 700;
  font-size: 14px;
  color: var(--pg-accent);
  letter-spacing: -0.5px;
  user-select: none;
}

.playground-header-sep {
  width: 1px;
  height: 18px;
  background: var(--pg-border);
  margin: 0 4px;
}

.playground-header-select {
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--pg-border);
  background-color: var(--pg-input-bg);
  color: var(--pg-text-secondary);
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  outline: none;
  transition: all 150ms;

  &:hover {
    border-color: var(--pg-text-muted);
  }

  &:focus {
    border-color: var(--pg-accent);
    box-shadow: var(--pg-focus-ring);
  }
}

.playground-header-theme-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--pg-border);
  background: var(--pg-input-bg);
  color: var(--pg-text-secondary);
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    border-color: var(--pg-text-muted);
    color: var(--pg-text-primary);
  }
}

.playground-header-theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms ease;

  &.dark {
    transform: rotate(180deg);
  }
}
</style>
