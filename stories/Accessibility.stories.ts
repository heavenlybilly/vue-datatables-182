import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import TableExample from './TableExample.vue'
import { englishMessages } from './messages-en'

const meta = { title: 'Таблица/Доступность и локализация', component: TableExample } satisfies Meta<
  typeof TableExample
>
export default meta
type Story = StoryObj<typeof meta>

export const Keyboard: Story = {
  name: 'Клавиатура, фокус и частичный выбор',
  args: {
    tableProps: {
      selection: true,
      rowsClickable: true,
      selectOnRowClick: true,
      selectionLimit: 3,
      defaultRowsPerPageCount: 5,
      rowsPerPageOptions: [5, 10],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Tab перемещает фокус между поиском, сортировкой, выбором, действием строки и пагинацией. Enter активирует кнопки, Space переключает checkbox. Действие строки становится видимым при фокусе.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sort = canvas.getByRole('button', { name: 'Сортировать: Название' })
    sort.focus()
    await expect(sort).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(canvas.getByRole('columnheader', { name: 'Название' })).toHaveAttribute(
        'aria-sort',
        'ascending',
      ),
    )
    const first = canvas.getByRole('checkbox', { name: 'Выбрать строку 1' })
    first.focus()
    await userEvent.keyboard('[Space]')
    await waitFor(() => {
      expect(first).toBeChecked()
      expect(canvas.getByRole('checkbox', { name: 'Выбрать все видимые строки' })).toHaveAttribute(
        'aria-checked',
        'mixed',
      )
    })
    const next = canvas.getByRole('button', { name: 'Следующая страница' })
    next.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() =>
      expect(canvas.getByRole('checkbox', { name: 'Выбрать строку 6' })).not.toBeChecked(),
    )
  },
}
export const English: Story = {
  name: 'Локальная английская конфигурация',
  args: {
    tableProps: {
      messages: englishMessages,
      selection: true,
      defaultRowsPerPageCount: 5,
      rowsPerPageOptions: [5, 10],
    },
  },
}
export const Empty: Story = {
  name: 'Переведённое пустое состояние',
  args: { tableProps: { messages: englishMessages, items: [] } },
}
