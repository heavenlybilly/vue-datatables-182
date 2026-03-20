import { type CSSProperties, type Ref, computed, onUnmounted, ref, watch } from 'vue'
import { usePersistentState } from '~/usePersistentState'

interface PanelRect {
  top: number
  left: number
  width: number
  height: number
}

interface DraggableResizableOptions {
  dragHandleSelector: string
  storageKey: string
  defaults: PanelRect
  minWidth?: number
  minHeight?: number
}

interface Edges {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

let cursorStyleInjected = false

const injectCursorStyle = () => {
  if (cursorStyleInjected) return
  const style = document.createElement('style')
  style.textContent =
    'body.dt-cursor-override, body.dt-cursor-override * { cursor: var(--dt-cursor) !important; }'
  document.head.appendChild(style)
  cursorStyleInjected = true
}

const setCursorOverride = (cursor: string) => {
  document.body.style.setProperty('--dt-cursor', cursor)
  document.body.classList.add('dt-cursor-override')
}

const clearCursorOverride = () => {
  document.body.classList.remove('dt-cursor-override')
  document.body.style.removeProperty('--dt-cursor')
}

export const useDraggableResizable = (
  panelRef: Ref<HTMLElement | null>,
  options: DraggableResizableOptions,
) => {
  const { dragHandleSelector, storageKey, defaults, minWidth = 300, minHeight = 200 } = options

  const panelTop = ref(defaults.top)
  const panelLeft = ref(defaults.left)
  const panelWidth = ref(defaults.width)
  const panelHeight = ref(defaults.height)

  usePersistentState(storageKey, {
    top: panelTop,
    left: panelLeft,
    width: panelWidth,
    height: panelHeight,
  })

  injectCursorStyle()

  // --- Drag ---
  let dragStartX = 0
  let dragStartY = 0
  let dragStartTop = 0
  let dragStartLeft = 0
  let dragHandleEl: HTMLElement | null = null

  const onDragStart = (e: MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragStartTop = panelTop.value
    dragStartLeft = panelLeft.value
    setCursorOverride('grabbing')
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)
  }

  const onDragMove = (e: MouseEvent) => {
    panelTop.value = Math.max(
      0,
      Math.min(dragStartTop + e.clientY - dragStartY, window.innerHeight - 50),
    )
    panelLeft.value = Math.max(
      -(panelWidth.value - 50),
      Math.min(dragStartLeft + e.clientX - dragStartX, window.innerWidth - 50),
    )
  }

  const onDragEnd = () => {
    clearCursorOverride()
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragEnd)
  }

  // --- Resize ---
  let activeEdges: Edges = { top: false, right: false, bottom: false, left: false }
  let resizeStartX = 0
  let resizeStartY = 0
  let resizeStartRect: PanelRect = { top: 0, left: 0, width: 0, height: 0 }

  const makeResizeStart = (edges: Edges, cursor: string) => (e: MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    activeEdges = edges
    resizeStartX = e.clientX
    resizeStartY = e.clientY
    resizeStartRect = {
      top: panelTop.value,
      left: panelLeft.value,
      width: panelWidth.value,
      height: panelHeight.value,
    }
    setCursorOverride(cursor)
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
  }

  const onResizeMove = (e: MouseEvent) => {
    const dx = e.clientX - resizeStartX
    const dy = e.clientY - resizeStartY
    const { top: sT, left: sL, width: sW, height: sH } = resizeStartRect

    if (activeEdges.right) {
      panelWidth.value = Math.max(minWidth, sW + dx)
    }
    if (activeEdges.bottom) {
      panelHeight.value = Math.max(minHeight, sH + dy)
    }
    if (activeEdges.left) {
      const w = Math.max(minWidth, sW - dx)
      panelLeft.value = sL + sW - w
      panelWidth.value = w
    }
    if (activeEdges.top) {
      const h = Math.max(minHeight, sH - dy)
      panelTop.value = sT + sH - h
      panelHeight.value = h
    }
  }

  const onResizeEnd = () => {
    clearCursorOverride()
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
  }

  // --- Resize handle elements ---
  const handleEls: HTMLElement[] = []

  const createHandle = (edges: Edges, cursor: string, css: Record<string, string>) => {
    const el = document.createElement('div')
    Object.assign(el.style, { position: 'absolute', zIndex: '10', cursor, ...css })
    el.addEventListener('mousedown', makeResizeStart(edges, cursor))
    return el
  }

  const E = '6px'
  const C = '12px'

  const HANDLE_DEFS: [Edges, string, Record<string, string>][] = [
    // Edges
    [
      { top: true, right: false, bottom: false, left: false },
      'n-resize',
      { top: '0', left: C, right: C, height: E },
    ],
    [
      { top: false, right: false, bottom: true, left: false },
      's-resize',
      { bottom: '0', left: C, right: C, height: E },
    ],
    [
      { top: false, right: false, bottom: false, left: true },
      'w-resize',
      { left: '0', top: C, bottom: C, width: E },
    ],
    [
      { top: false, right: true, bottom: false, left: false },
      'e-resize',
      { right: '0', top: C, bottom: C, width: E },
    ],
    // Corners
    [
      { top: true, right: false, bottom: false, left: true },
      'nw-resize',
      { top: '0', left: '0', width: C, height: C },
    ],
    [
      { top: true, right: true, bottom: false, left: false },
      'ne-resize',
      { top: '0', right: '0', width: C, height: C },
    ],
    [
      { top: false, right: false, bottom: true, left: true },
      'sw-resize',
      { bottom: '0', left: '0', width: C, height: C },
    ],
    [
      { top: false, right: true, bottom: true, left: false },
      'se-resize',
      { bottom: '0', right: '0', width: C, height: C },
    ],
  ]

  const setup = (panel: HTMLElement) => {
    dragHandleEl = panel.querySelector(dragHandleSelector)
    if (dragHandleEl) {
      dragHandleEl.style.cursor = 'grab'
      dragHandleEl.addEventListener('mousedown', onDragStart)
    }

    for (const [edges, cursor, css] of HANDLE_DEFS) {
      const el = createHandle(edges, cursor, css)
      handleEls.push(el)
      panel.appendChild(el)
    }
  }

  const teardown = () => {
    if (dragHandleEl) {
      dragHandleEl.removeEventListener('mousedown', onDragStart)
      dragHandleEl.style.cursor = ''
      dragHandleEl = null
    }
    handleEls.forEach((el) => el.remove())
    handleEls.length = 0
  }

  watch(
    panelRef,
    (el) => {
      teardown()
      if (el) setup(el)
    },
    { flush: 'post' },
  )

  onUnmounted(() => {
    teardown()
    onDragEnd()
    onResizeEnd()
  })

  const style = computed<CSSProperties>(() => ({
    position: 'fixed',
    top: `${panelTop.value}px`,
    left: `${panelLeft.value}px`,
    width: `${panelWidth.value}px`,
    height: `${panelHeight.value}px`,
  }))

  return { style }
}
