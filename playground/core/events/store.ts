// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type EventLogEntry = {
  id: number
  timestamp: number
  name: string
  payload: unknown
}

const MAX_EVENTS = 200

export const useEventLogStore = defineStore('playground-event-log', () => {
  const events = ref<EventLogEntry[]>([])
  let nextId = 1

  const addEvent = (name: string, payload?: unknown) => {
    nextId += 1
    events.value.unshift({
      id: nextId,
      timestamp: Date.now(),
      name,
      payload,
    })

    if (events.value.length > MAX_EVENTS) {
      events.value = events.value.slice(0, MAX_EVENTS)
    }
  }

  const clearEvents = () => {
    events.value = []
  }

  return {
    events,
    addEvent,
    clearEvents,
  }
})
