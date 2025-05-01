import { watch, onMounted, toRaw, isRef, isReactive, Ref } from 'vue'

type State = Record<string, any>
type StateRefs = Record<string, any>

export const usePersistentState = <T extends State | StateRefs>(storageKey: string, source: Ref<string>, state: T) => {
  const triggerUpdateState = () => {
    const saved = localStorage.getItem(`${storageKey}_${source.value}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        for (const prop in parsed) {
          if (prop in state) {
            if (isRef(state[prop])) {
              state[prop].value = parsed[prop]
            } else if (isReactive(state[prop])) {
              Object.assign(state[prop], parsed[prop])
            } else {
              state[prop] = parsed[prop]
            }
          }
        }
      } catch (e) {
        console.warn(`Не удалось загрузить состояние из localStorage: ${e}`)
      }
    }
  }

  onMounted(() => {
    triggerUpdateState()
  })

  watch(
    () => {
      const snapshot: Record<string, any> = {}
      for (const key in state) {
        if (isRef(state[key])) {
          snapshot[key] = state[key].value
        } else if (isReactive(state[key])) {
          snapshot[key] = toRaw(state[key])
        } else {
          snapshot[key] = state[key]
        }
      }
      return snapshot
    },
    (newVal) => {
      localStorage.setItem(`${storageKey}_${source.value}`, JSON.stringify(newVal))
    },
    { deep: true }
  )

  return {
    triggerUpdateState,
  }
}