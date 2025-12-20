import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import ControlledExample from './ControlledExample.vue'
import DynamicColumns from './DynamicColumns.vue'
import ReactiveData from './ReactiveData.vue'
import TableExample from './TableExample.vue'
import TypedTable from './TypedTable.vue'

const meta = { title: 'Таблица/Интеграция', component: ControlledExample } satisfies Meta<
  typeof ControlledExample
>
export default meta
type Story = StoryObj<typeof meta>

export const Controlled: Story = { name: 'Состояние управляется родителем' }
export const Independent: Story = {
  name: 'Две независимые таблицы',
  render: () => ({
    components: { TableExample },
    template:
      '<section><h2>Первая таблица</h2><TableExample :table-props="{ search: true, selection: true }" /><h2>Вторая таблица</h2><TableExample :table-props="{ search: true, selection: true, defaultRowsPerPageCount: 5 }" /></section>',
  }),
}

export const Columns: Story = {
  name: 'Динамические колонки',
  render: () => ({ components: { DynamicColumns }, template: '<DynamicColumns />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table')
    const title = canvas.getByRole('textbox', { name: 'Заголовок' })
    await userEvent.clear(title)
    await userEvent.type(title, 'Новый заголовок')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Закреплять название' }))
    await waitFor(() => {
      expect(canvas.getByRole('columnheader', { name: 'Новый заголовок' })).toHaveStyle({
        position: 'sticky',
      })
      expect(canvas.getByRole('table')).toBe(table)
    })
  },
}

export const ReactiveItems: Story = {
  name: 'Обновление данных без remount',
  render: () => ({ components: { ReactiveData }, template: '<ReactiveData />' }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Выбрать строку 1' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Обновить данные' }))
    await waitFor(() => {
      expect(canvas.getByRole('cell', { name: 'После обновления' })).toBeVisible()
      expect(canvas.getByRole('checkbox', { name: 'Выбрать строку 1' })).toBeChecked()
      expect(canvas.getByRole('table')).toBe(table)
    })
  },
}

export const Typed: Story = {
  name: 'Типизированная фабрика компонентов',
  render: () => ({ components: { TypedTable }, template: '<TypedTable />' }),
}
