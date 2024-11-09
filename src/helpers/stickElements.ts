export const stickElements = (
  root: HTMLElement,
  childElementTag: string,
  count: number,
  reverse: boolean = false,
): void => {
  const children = Array.from(root.getElementsByTagName(childElementTag)) as HTMLElement[]

  const selectedElements = reverse ? children.slice(-count).reverse() : children.slice(0, count)

  const positionProp: 'left' | 'right' = reverse ? 'right' : 'left'

  selectedElements.reduce((accumulatedWidth, child) => {
    const element = child
    element.style.position = 'sticky'
    element.style[positionProp] = `${accumulatedWidth}px`

    return accumulatedWidth + element.offsetWidth + 1
  }, 0)
}
