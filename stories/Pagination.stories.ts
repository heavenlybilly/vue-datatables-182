import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TableExample from './TableExample.vue'

const meta = {
  title: 'Таблица/Пагинация',
  component: TableExample,
  tags: ['autodocs'],
} satisfies Meta<typeof TableExample>
export default meta
type Story = StoryObj<typeof meta>

export const Pages: Story = {
  name: 'Переключение страниц и размера',
  args: { tableProps: { defaultRowsPerPageCount: 5, rowsPerPageOptions: [5, 10, 20] } },
}
export const LastPage: Story = {
  name: 'Неполная последняя страница',
  args: { tableProps: { defaultPage: 5, defaultRowsPerPageCount: 10 } },
}
export const Disabled: Story = {
  name: 'Без пагинации',
  args: { tableProps: { pagination: false } },
}
export const SinglePage: Story = {
  name: 'Одна страница',
  args: { tableProps: { defaultRowsPerPageCount: 100, rowsPerPageOptions: [100] } },
}
