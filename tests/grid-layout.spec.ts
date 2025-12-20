import { describe, expect, it } from 'vitest'
import type { ColumnDef, ColumnKey } from '../src/components/columns/types'
import { buildGridLayout } from '../src/components/layout/table/build-grid-layout'
import { Sticky } from '../src/types'

const column = (key: string, width?: string, sticky?: Sticky): ColumnDef<unknown> => ({
  key: key as ColumnKey,
  width,
  sticky,
})

describe('grid layout', () => {
  it('orders sticky groups and accumulates offsets on both sides', () => {
    const layout = buildGridLayout(
      [
        column('normal'),
        column('right-first', '30px', Sticky.RIGHT),
        column('left-first', '50px', Sticky.LEFT),
        column('right-last', '40px', Sticky.RIGHT),
        column('left-last', '60px', Sticky.LEFT),
      ],
      false,
    )
    expect(layout.orderedColumns.map(({ key }) => key)).toEqual([
      'left-first',
      'left-last',
      'normal',
      'right-first',
      'right-last',
    ])
    expect(layout.stickyOffsets).toEqual({
      'left-first': { left: '0px' },
      'left-last': { left: '50px' },
      'right-last': { right: '0px' },
      'right-first': { right: '40px' },
    })
  })

  it('rejects a sticky column without a measurable width', () => {
    expect(() => buildGridLayout([column('name', undefined, Sticky.LEFT)], true)).toThrow(
      'Sticky column must have width',
    )
  })
})
