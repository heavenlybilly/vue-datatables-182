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

  const positionProp: 'left' | 'right' = reverse ? 'right' : 'left'

  selectedElements.reduce((accumulatedWidth, child) => {
    const element = child
    const elementWidth = element.offsetWidth

    element.style[positionProp] = `${accumulatedWidth}px`
    element.style.position = 'sticky'

    return accumulatedWidth + elementWidth
  }, 0)
}
