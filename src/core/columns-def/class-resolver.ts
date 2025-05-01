export const resolveClassObject = (classRaw?: string): Record<string, boolean> => {
  if (!classRaw) {
    return {}
  }

  return classRaw.split(' ').reduce(
    (classObjectCarry: Record<string, boolean>, className: string) => ({
      ...classObjectCarry,
      [className]: true,
    }),
    {},
  )
}
