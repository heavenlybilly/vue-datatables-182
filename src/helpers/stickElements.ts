export const stickElements = (
  root: HTMLElement,
  childElementTag: string,
  count: number,
  reverse: boolean = false,
): void => {
  if (!count) {
    return
  }

  const children = Array.from(root.getElementsByTagName(childElementTag)) as HTMLElement[]

  const selectedElements = reverse ? children.slice(-count).reverse() : children.slice(0, count)

  const positionProp = reverse ? 'right' : 'left'
  const className = reverse ? 'dt182-sticky-end' : 'dt182-sticky-start'

  selectedElements.reduce((accumulatedWidth, child, index) => {
    const element = child
    const elementWidth = element.offsetWidth

    element.style[positionProp] = `${accumulatedWidth}px`
    element.classList.add(className)
    element.style.position = 'sticky'

    if ((reverse && index === 0) || (!reverse && index === count - 1)) {
      element.classList.add('dt182-sticky-extreme')
    }

    return accumulatedWidth + elementWidth
  }, 0)
}
