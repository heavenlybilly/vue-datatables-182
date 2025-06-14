import { DTTextAlign } from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'
import { props } from '@/core/columns-def/props'

const extractPropValue = <T>(propName: keyof typeof props, propsData: object): T => {
  const propDef = props[propName]

  if (propDef === undefined) {
    throw new VueDatatables182Error(
      ErrorCategory.WRONG_COLUMN_PROP_NAME,
      `Prop with the name ‘${propName}’ was not found in the column props definition`,
    )
  }

  if (!Object.prototype.hasOwnProperty.call(propsData, propName)) {
    if (propDef.required) {
      throw new VueDatatables182Error(
        ErrorCategory.REQUIRED_COLUMN_PROP,
        `Prop '${propName}' is required for the column definition, but no value was provided`,
      )
    }

    const defaultValue = 'default' in propDef ? propDef.default : undefined

    if (propDef.type instanceof Boolean) {
      return (defaultValue ?? false) as T
    }

    return defaultValue as T
  }

  // @ts-ignore
  return propsData[propName] as T
}

export const extractProps = (propsData: object) => {
  return {
    field: extractPropValue<string>('field', propsData),
    title: extractPropValue<string>('title', propsData),
    orderable: extractPropValue<boolean>('orderable', propsData),
    searchable: extractPropValue<boolean>('searchable', propsData),
    width: extractPropValue<string | undefined>('width', propsData),
    textAlign: extractPropValue<DTTextAlign | undefined>('textAlign', propsData),
  }
}
