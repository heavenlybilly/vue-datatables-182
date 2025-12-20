import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

export const useViewportWidth = (element: Ref<HTMLElement | null>) => {
  const width = ref<string>()
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!element.value) {
      return
    }

    const measure = () => {
      width.value = `${element.value?.clientWidth ?? 0}px`
    }

    measure()

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(element.value)
    }
  })
  onBeforeUnmount(() => observer?.disconnect())

  return width
}
