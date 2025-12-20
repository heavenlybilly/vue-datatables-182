import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, waitFor, within } from 'storybook/test'
import { DataTable, DataTableColumn } from '../src'
import TableExample from './TableExample.vue'

const meta = {
  title: 'Таблица/Прокрутка и закрепление',
  component: TableExample,
  tags: ['autodocs'],
} satisfies Meta<typeof TableExample>
export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  name: 'Горизонтальная прокрутка',
  args: { wide: true, tableProps: { scrollX: true } },
}
export const NarrowContent: Story = {
  name: 'Длинный текст в узком контейнере',
  render: () => ({
    components: { DataTable, DataTableColumn },
    setup: () => ({
      items: [{ id: 1, name: 'A'.repeat(120), description: 'Длинное описание '.repeat(12) }],
    }),
    template:
      '<DataTable :items="items" row-key="id" source="local"><DataTableColumn field="name" title="Имя" /><DataTableColumn field="description" title="Описание" /></DataTable>',
  }),
  decorators: [() => ({ template: '<div style="max-width: 320px"><story /></div>' })],
}
export const HeaderInContainer: Story = {
  name: 'Заголовок внутри ограниченного контейнера',
  args: { bounded: true, tableProps: { pagination: false, scrollX: true, stickyHeader: true } },
}
export const StickyColumns: Story = {
  name: 'Два столбца слева и один справа',
  args: { wide: true, pinned: true, tableProps: { scrollX: true } },
}
export const Combined: Story = {
  name: 'Заголовок и столбцы при прокрутке по двум осям',
  args: {
    bounded: true,
    wide: true,
    pinned: true,
    tableProps: {
      pagination: false,
      scrollX: true,
      stickyHeader: true,
      numbering: true,
      selection: true,
      striped: true,
      verticalBorders: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const viewport = canvas.getByRole('region')
    const left = canvas.getByRole('columnheader', { name: 'ID' })
    const right = canvas.getByRole('columnheader', { name: 'Сумма' })
    const initialLeft = left.getBoundingClientRect()
    const initialRight = right.getBoundingClientRect()
    viewport.scrollTo({ left: 240, top: 120 })
    await waitFor(() => {
      expect(viewport.scrollLeft).toBeGreaterThan(0)
      expect(viewport.scrollTop).toBeGreaterThan(0)
      expect(Math.abs(left.getBoundingClientRect().left - initialLeft.left)).toBeLessThanOrEqual(1)
      expect(Math.abs(left.getBoundingClientRect().top - initialLeft.top)).toBeLessThanOrEqual(1)
      expect(
        Math.abs(right.getBoundingClientRect().right - initialRight.right),
      ).toBeLessThanOrEqual(1)
    })
  },
}
export const UnpinnedHeader: Story = {
  name: 'Контейнер без закрепления заголовка',
  args: { bounded: true, wide: true, tableProps: { pagination: false, scrollX: true } },
}
export const WideEmpty: Story = {
  name: 'Пустое состояние при широких столбцах',
  args: {
    bounded: true,
    wide: true,
    pinned: true,
    tableProps: { items: [], scrollX: true, stickyHeader: true },
  },
}
