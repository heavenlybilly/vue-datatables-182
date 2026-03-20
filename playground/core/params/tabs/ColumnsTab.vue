<script setup lang="ts">
import VCheckbox from '~/core/params/components/VCheckbox.vue'
import { useColumnsStore } from '~/core/columns/store'
import { useTableRendering } from '~/useTableRendering'

const columnsStore = useColumnsStore()
const { reRender } = useTableRendering()

const handleToggle = (
  field: string,
  prop: 'visible' | 'searchable' | 'sortable',
  value: boolean,
) => {
  columnsStore.updateColumn(field, { [prop]: value })
  reRender()
}

const handleTextChange = (field: string, prop: 'title' | 'width' | 'textAlign', value: string) => {
  columnsStore.updateColumn(field, { [prop]: value })
  reRender()
}

const handleMove = (field: string, dir: 'up' | 'down') => {
  columnsStore.moveColumn(field, dir)
  reRender()
}

const handleInputEvent = (field: string, prop: 'title' | 'width' | 'textAlign', e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    handleTextChange(field, prop, e.target.value)
  }
}

const handleReset = () => {
  columnsStore.resetColumns()
  reRender()
}
</script>

<template>
  <div class="columns-tab">
    <div class="columns-tab-header">
      <span class="columns-tab-title">Columns ({{ columnsStore.columns.length }})</span>
      <button
        class="columns-tab-reset"
        @click="handleReset"
      >
        Reset
      </button>
    </div>

    <div class="columns-tab-list">
      <div
        v-for="(col, index) of columnsStore.columns"
        :key="col.field"
        class="columns-tab-item"
        :class="{ disabled: !col.visible }"
      >
        <div class="columns-tab-item-header">
          <label class="columns-tab-item-toggle">
            <v-checkbox
              :value="col.visible"
              @input="handleToggle(col.field, 'visible', !col.visible)"
            />
            <span class="columns-tab-item-field">{{ col.field }}</span>
          </label>

          <div class="columns-tab-item-arrows">
            <button
              class="columns-tab-arrow"
              :disabled="index === 0"
              title="Move up"
              @click="handleMove(col.field, 'up')"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              class="columns-tab-arrow"
              :disabled="index === columnsStore.columns.length - 1"
              title="Move down"
              @click="handleMove(col.field, 'down')"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-if="col.visible"
          class="columns-tab-item-props"
        >
          <div class="columns-tab-prop">
            <label class="columns-tab-prop-label">Title</label>
            <input
              class="columns-tab-prop-input"
              type="text"
              :value="col.title"
              @input="(e) => handleInputEvent(col.field, 'title', e)"
            />
          </div>

          <div class="columns-tab-prop-row">
            <label class="columns-tab-prop-toggle">
              <v-checkbox
                :value="col.searchable"
                @input="handleToggle(col.field, 'searchable', !col.searchable)"
              />
              <span>Searchable</span>
            </label>
            <label class="columns-tab-prop-toggle">
              <v-checkbox
                :value="col.sortable"
                @input="handleToggle(col.field, 'sortable', !col.sortable)"
              />
              <span>Sortable</span>
            </label>
          </div>

          <div class="columns-tab-prop-row">
            <div class="columns-tab-prop columns-tab-prop--half">
              <label class="columns-tab-prop-label">Width</label>
              <input
                class="columns-tab-prop-input"
                placeholder="auto"
                type="text"
                :value="col.width"
                @input="(e) => handleInputEvent(col.field, 'width', e)"
              />
            </div>
            <div class="columns-tab-prop columns-tab-prop--half">
              <label class="columns-tab-prop-label">Align</label>
              <input
                class="columns-tab-prop-input"
                placeholder="left"
                type="text"
                :value="col.textAlign"
                @input="(e) => handleInputEvent(col.field, 'textAlign', e)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.columns-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.columns-tab-title {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--pg-text-primary);
}

.columns-tab-reset {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--pg-accent-bg);
  color: var(--pg-accent);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms;

  &:hover {
    background: var(--pg-accent);
    color: #fff;
  }
}

.columns-tab-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.columns-tab-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--pg-bg-secondary);
  border: 1px solid var(--pg-border);
  transition:
    opacity 200ms,
    border-color 200ms;

  &:hover:not(.disabled) {
    border-color: var(--pg-accent-bg);
  }

  &.disabled {
    opacity: 0.5;
  }
}

.columns-tab-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.columns-tab-item-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.columns-tab-item-field {
  font-weight: 600;
  font-size: 12px;
  color: var(--pg-text-secondary);
}

.columns-tab-item-arrows {
  display: flex;
  gap: 2px;
}

.columns-tab-arrow {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--pg-border);
  border-radius: 5px;
  cursor: pointer;
  color: var(--pg-text-muted);
  transition: all 200ms;

  &:hover:not(:disabled) {
    border-color: var(--pg-accent);
    color: var(--pg-accent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.columns-tab-item-props {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.columns-tab-prop {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.columns-tab-prop--half {
  flex: 1;
}

.columns-tab-prop-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--pg-text-muted);
}

.columns-tab-prop-input {
  width: 100%;
  padding: 6px 8px;
  font-size: 11px;
  border: 1px solid var(--pg-input-border);
  border-radius: 6px;
  background: var(--pg-input-bg);
  color: var(--pg-text-secondary);
  outline: none;
  transition: border-color 200ms;

  &:focus {
    border-color: var(--pg-accent);
    box-shadow: var(--pg-focus-ring);
  }
}

.columns-tab-prop-row {
  display: flex;
  gap: 8px;
}

.columns-tab-prop-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 11px;
  color: var(--pg-text-secondary);
}
</style>
