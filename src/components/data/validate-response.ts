import type { RequestContext, RowItem, RowKey, TableData } from '../../types'
import { validateRowKeys } from '../core/row-keys'
import { isPlainObject } from './json-value'

export const validateResponse = (
  value: unknown,
  context: RequestContext,
  selector: (item: RowItem) => RowKey,
): TableData => {
  if (!isPlainObject(value)) {
    throw new Error('responseAdapter must return an object')
  }

  const { items, total } = value
  const filtered = value.filtered === undefined ? total : value.filtered

  const count = (input: unknown): input is number =>
    typeof input === 'number' && Number.isSafeInteger(input) && input >= 0

  if (!count(total) || !count(filtered) || filtered > total) {
    throw new Error('response counts must be non-negative safe integers with filtered <= total')
  }

  if (!Array.isArray(items)) {
    throw new Error('response items must be an array')
  }

  if (
    items.length > filtered ||
    (context.pagination && items.length > (context.requestBody.perPage as number))
  ) {
    throw new Error('response items length must not exceed filtered or perPage')
  }

  if (!context.pagination && items.length !== filtered) {
    throw new Error('response items must contain the full filtered result without pagination')
  }

  validateRowKeys(items, selector)

  return {
    items: [...items],
    total,
    filtered,
  }
}

export const responsePage = (data: TableData, context: RequestContext): number =>
  context.pagination
    ? Math.min(
        context.requestBody.page as number,
        Math.max(1, Math.ceil(data.filtered / (context.requestBody.perPage as number))),
      )
    : 1
