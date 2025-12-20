import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TableExample from './TableExample.vue'

const meta = {
  title: 'Таблица/Выбор строк',
  component: TableExample,
  tags: ['autodocs'],
} satisfies Meta<typeof TableExample>
export default meta
type Story = StoryObj<typeof meta>

export const Multiple: Story = {
  name: 'Выбор строк и всех видимых',
  args: { tableProps: { selection: true, allowSelectAll: true } },
}
export const Partial: Story = {
  name: 'Частичный выбор',
  args: { tableProps: { selection: true, allowSelectAll: true, defaultSelectedRowKeys: [1, 3] } },
}
export const Limited: Story = {
  name: 'Не более трёх строк',
  args: { tableProps: { selection: true, allowSelectAll: true, selectionLimit: 3 } },
}
export const RowClick: Story = {
  name: 'Выбор нажатием на строку',
  args: { tableProps: { selection: true, rowsClickable: true, selectOnRowClick: true } },
}
