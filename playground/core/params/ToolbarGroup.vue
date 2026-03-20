<script setup lang="ts">
import { computed, ref } from 'vue'
import ToolbarControl from '~/core/params/ToolbarControl.vue'
import { ControlType, ToolbarGroup } from '~/types'

const props = defineProps<{
  tableParams: Record<string, unknown>
  group: ToolbarGroup
  initialCollapsed?: boolean
}>()

const emit = defineEmits(['input'])

const collapsed = ref(props.initialCollapsed ?? false)

const toggle = () => {
  collapsed.value = !collapsed.value
}

const isSwitcherOnly = computed(() => {
  return props.group.controls.every(
    (c) => c.hidden || c.type === ControlType.SWITCHER,
  )
})

const controlItems = computed(() => {
  return props.group.controls
    .filter((control) => !control.hidden)
    .map((control) => {
      let value = props.tableParams?.[control.name]

      if (value === undefined && control.params?.defaultValue !== undefined) {
        value = control.params.defaultValue
      }

      return {
        control,
        value,
      }
    })
})

const handleInput = (name: string, value: unknown) => {
  emit('input', { name, value })
}
</script>

<template>
  <div
    class="playground-toolbar-group"
    :class="{ collapsed }"
  >
    <button
      class="playground-toolbar-group-header"
      @click="toggle"
    >
      <div class="playground-toolbar-group-title">{{ props.group.title }}</div>
      <div class="playground-toolbar-group-chevron">
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
      </div>
    </button>

    <div class="playground-toolbar-group-body">
      <div
        class="playground-toolbar-group-controls"
        :class="{ 'playground-toolbar-group-controls--switchers': isSwitcherOnly }"
      >
        <div
          v-for="item of controlItems"
          :key="item.control.name"
          class="playground-toolbar-group-control"
          :class="{ 'playground-toolbar-group-control--switcher': item.control.type === ControlType.SWITCHER && isSwitcherOnly }"
        >
          <template v-if="item.control.type === ControlType.SWITCHER && isSwitcherOnly">
            <label
              class="playground-toolbar-group-control-inline"
              :title="item.control.description"
            >
              <span class="playground-toolbar-group-control-inline-label">
                {{ item.control.name.replace(/([a-z])([A-Z])/g, '$1 $2') }}
              </span>
              <toolbar-control
                :control="item.control"
                :value="item.value"
                @input="(value) => handleInput(item.control.name, value)"
              />
            </label>
          </template>

          <template v-else>
            <div
              class="playground-toolbar-group-control-label"
              :class="{ required: item.control.required }"
              :title="item.control.description"
            >
              {{ item.control.name.replace(/([a-z])([A-Z])/g, '$1 $2') }}
            </div>

            <div
              v-if="item.control.description"
              class="playground-toolbar-group-control-hint"
            >
              {{ item.control.description }}
            </div>

            <toolbar-control
              :control="item.control"
              :value="item.value"
              @input="(value) => handleInput(item.control.name, value)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.playground-toolbar-group {
  display: flex;
  flex-direction: column;
}

.playground-toolbar-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--pg-border);
  color: inherit;
}

.playground-toolbar-group-title {
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--pg-text-muted);
}

.playground-toolbar-group-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--pg-text-muted);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  .collapsed & {
    transform: rotate(-90deg);
  }
}

.playground-toolbar-group-body {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  .collapsed & {
    grid-template-rows: 0fr;
  }
}

.playground-toolbar-group-controls {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;

  &--switchers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 6px 16px;
  }
}

.playground-toolbar-group-control {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--switcher {
    flex-direction: row;
  }
}

.playground-toolbar-group-control-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  padding: 5px 8px;
  border-radius: 6px;
  transition: background 150ms;

  &:hover {
    background: var(--pg-bg-tertiary);
  }
}

.playground-toolbar-group-control-inline-label {
  font-weight: 500;
  font-size: 12px;
  color: var(--pg-text-secondary);
  text-transform: capitalize;
  user-select: none;
}

.playground-toolbar-group-control-label {
  position: relative;
  font-weight: 600;
  font-size: 12px;
  color: var(--pg-text-primary);

  &.required {
    &:after {
      position: relative;
      right: -2px;
      content: '*';
      color: #ef4444;
      font-size: 12px;
    }
  }
}

.playground-toolbar-group-control-hint {
  font-size: 11px;
  color: var(--pg-text-muted);
  line-height: 1.4;
}
</style>
