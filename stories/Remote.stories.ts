import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Source } from '../src'
import TableExample from './TableExample.vue'
import { remoteHandlers } from './remote-handlers'

const meta = {
  title: 'Таблица/Удалённые данные',
  component: TableExample,
  args: { tableProps: { source: Source.REMOTE, url: '/storybook-api/rows', search: true } },
  beforeEach: ({ msw, parameters }) => {
    msw.use(...remoteHandlers(parameters.remoteMode ?? 'normal'))
  },
} satisfies Meta<typeof TableExample>
export default meta
type Story = StoryObj<typeof meta>

export const Server: Story = {
  name: 'Поиск, сортировка и пагинация на сервере',
  parameters: { remoteMode: 'normal' },
}
export const Slow: Story = {
  name: 'Загрузка и отмена устаревших запросов',
  parameters: {
    remoteMode: 'slow',
    docs: {
      description: {
        story:
          'Изменяйте поиск или страницу до завершения запроса. Должен отображаться только последний результат.',
      },
    },
  },
}
export const Error: Story = {
  name: 'Ошибка сервера',
  parameters: { remoteMode: 'error' },
}
export const Retry: Story = {
  name: 'Ошибка и успешный повтор',
  parameters: { remoteMode: 'retry' },
}
export const Empty: Story = {
  name: 'Сервер вернул пустые данные',
  parameters: { remoteMode: 'empty' },
}
export const CustomLoading: Story = {
  name: 'Пользовательская загрузка',
  args: { customStates: true },
  parameters: { remoteMode: 'slow' },
}
export const CustomError: Story = {
  name: 'Пользовательская ошибка и повтор',
  args: { customStates: true },
  parameters: { remoteMode: 'retry' },
}
