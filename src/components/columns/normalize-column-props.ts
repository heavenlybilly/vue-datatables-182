import { normalizeClass } from 'vue'
import type { DataTableColumnProps } from '../../types'
import { Sticky, TextAlign } from '../../types'

export const normalizeColumnProps = (raw: Record<string, unknown>) => {
  const read = (name: string) =>
    raw[name] !== undefined
      ? raw[name]
      : raw[name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)]

  const string = (name: string): string | undefined => {
    const value = read(name)

    if (value === undefined) {
      return undefined
    }

    if (typeof value !== 'string') {
      throw new Error(`Column ${name} must be a string`)
    }

    return value
  }

  const boolean = (name: string): boolean => {
    const value = read(name)

    if (value === undefined) {
      return false
    }

    if (value === '') {
      return true
    }

    if (typeof value !== 'boolean') {
      throw new Error(`Column ${name} must be a boolean`)
    }

    return value
  }

  const value = read('value')

  if (value !== undefined && typeof value !== 'function') {
    throw new Error('Column value must be a function')
  }

  const sticky = string('sticky')

  if (sticky !== undefined && !Object.values(Sticky).includes(sticky as Sticky)) {
    throw new Error('Column sticky must be left or right')
  }

  const textAlign = string('textAlign')

  if (textAlign !== undefined && !Object.values(TextAlign).includes(textAlign as TextAlign)) {
    throw new Error('Column textAlign must be left, center or right')
  }

  const props: DataTableColumnProps = {
    title: string('title'),
    field: string('field'),
    value: value as DataTableColumnProps['value'],
    sortable: boolean('sortable'),
    searchable: boolean('searchable'),
    sortField: string('sortField'),
    width: string('width'),
    textAlign: textAlign as TextAlign | undefined,
    sticky: sticky as Sticky | undefined,
    textOverflow: string('textOverflow') as DataTableColumnProps['textOverflow'],
    headerTextOverflow: string('headerTextOverflow') as DataTableColumnProps['headerTextOverflow'],
  }

  const overflowFields = ['textOverflow', 'headerTextOverflow'] as const

  overflowFields.forEach((name) => {
    if (props[name] !== undefined && props[name] !== 'wrap' && props[name] !== 'ellipsis') {
      throw new Error(`Column ${name} must be wrap or ellipsis`)
    }
  })

  return {
    props,
    className: normalizeClass(raw.class),
  }
}
