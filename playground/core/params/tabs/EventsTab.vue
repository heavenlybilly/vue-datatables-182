<script setup lang="ts">
import { computed } from 'vue'
import { useEventLogStore } from '~/core/events/store'

const store = useEventLogStore()

const formatTime = (ts: number): string => {
  const d = new Date(ts)
  return `${d.toLocaleTimeString('en-GB', { hour12: false })}.${String(
    d.getMilliseconds(),
  ).padStart(3, '0')}`
}

const formatPayload = (payload: unknown): string => {
  if (payload === undefined || payload === null) return ''
  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload)
  }
}

const eventCount = computed(() => store.events.length)
</script>

<template>
  <div class="events-tab">
    <div class="events-tab-header">
      <span class="events-tab-title">Events ({{ eventCount }})</span>
      <button
        class="events-tab-clear"
        :disabled="eventCount === 0"
        @click="store.clearEvents()"
      >
        Clear
      </button>
    </div>

    <div
      v-if="eventCount === 0"
      class="events-tab-empty"
    >
      No events yet. Interact with the table to see events.
    </div>

    <div
      v-else
      class="events-tab-list"
    >
      <div
        v-for="event of store.events"
        :key="event.id"
        class="events-tab-item"
      >
        <div class="events-tab-item-header">
          <span class="events-tab-item-name">{{ event.name }}</span>
          <span class="events-tab-item-time">{{ formatTime(event.timestamp) }}</span>
        </div>
        <pre
          v-if="event.payload !== undefined && event.payload !== null"
          class="events-tab-item-payload"
          >{{ formatPayload(event.payload) }}</pre
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.events-tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.events-tab-title {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--pg-text-primary);
}

.events-tab-clear {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--pg-accent-bg);
  color: var(--pg-accent);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms;

  &:hover:not(:disabled) {
    background: var(--pg-accent);
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
}

.events-tab-empty {
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: var(--pg-text-muted);
}

.events-tab-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.events-tab-item {
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--pg-bg-secondary);
  border: 1px solid var(--pg-border);
  transition: border-color 200ms;

  &:hover {
    border-color: var(--pg-accent-bg);
  }
}

.events-tab-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.events-tab-item-name {
  font-weight: 600;
  font-size: 11px;
  color: var(--pg-accent);
}

.events-tab-item-time {
  font-size: 10px;
  color: var(--pg-text-muted);
  font-variant-numeric: tabular-nums;
}

.events-tab-item-payload {
  margin: 4px 0 0;
  padding: 4px 6px;
  font-size: 10px;
  line-height: 1.4;
  background: var(--pg-input-bg);
  border: 1px solid var(--pg-border);
  border-radius: 3px;
  color: var(--pg-text-secondary);
  overflow-x: auto;
  max-height: 120px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
