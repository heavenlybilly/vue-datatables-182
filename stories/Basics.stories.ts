import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import TableExample from './TableExample.vue'

const meta = {
  title: 'Таблица/Основные сценарии',
  component: TableExample,
  tags: ['autodocs'],
  render: (args) => ({
    components: { TableExample },
    setup: () => ({ args }),
    template: '<TableExample v-bind="args" />',
  }),
} satisfies Meta<typeof TableExample>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = { name: 'Обычная таблица' }
export const SearchAndSort: Story = {
  name: 'Поиск и сортировка',
  args: { tableProps: { search: true } },
}
export const Empty: Story = { name: 'Пустые данные', args: { tableProps: { items: [] } } }
export const NoResults: Story = {
  name: 'Нет результатов поиска',
  args: { tableProps: { search: true, defaultSearchQuery: 'несуществующая запись' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ничего не найдено.')).toBeVisible()
    const state = canvasElement.querySelector('.dt182-data-state--noResults') as HTMLElement
    await userEvent.click(within(state).getByRole('button', { name: 'Очистить поиск' }))
    await expect(canvas.getByRole('textbox', { name: 'Поиск' })).toHaveValue('')
    await expect(canvas.queryByText('Ничего не найдено.')).not.toBeInTheDocument()
    await expect(canvas.getAllByRole('row').length).toBeGreaterThan(1)
  },
}
export const CustomCells: Story = {
  name: 'Слот ячейки и его контекст',
  args: { customCell: true, tableProps: { numbering: true } },
}
export const CustomStates: Story = {
  name: 'Пользовательское пустое состояние',
  args: { customStates: true, tableProps: { items: [] } },
}
export const Appearance: Story = {
  name: 'Полосы и границы',
  args: { tableProps: { striped: true, verticalBorders: true, numbering: true } },
}
