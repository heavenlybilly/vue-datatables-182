# Типизация строк через `createTypedTable`

Функция `createTypedTable<T>()` связывает тип записи с компонентами таблицы
и колонки. Аргументы функции отсутствуют; тип передаётся как параметр `T`
и должен быть объектом.

Фабрика возвращает исходные `DataTable` и `DataTableColumn`. Обёртки,
дополнительная регистрация и отдельное состояние во время выполнения не создаются.
Обычные импорты компонентов остаются доступны.

## Пример

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { type SelectionChangePayload, createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

type User = {
  id: number
  name: string
  balance: number
}

const { DataTable, DataTableColumn } = createTypedTable<User>()
const table = ref<InstanceType<typeof DataTable>>()
const selectedNames = ref<string[]>([])
const users: User[] = [
  { id: 1, name: 'Анна', balance: 12500 },
  { id: 2, name: 'Борис', balance: 8400 },
]

function onSelection({ items }: SelectionChangePayload<User>) {
  selectedNames.value = items.map((item) => item.name)
}

function clear() {
  table.value?.clearSelection()
}
</script>

<template>
  <DataTable
    ref="table"
    :items="users"
    row-key="id"
    selection
    source="local"
    @selection-change="onSelection"
  >
    <DataTableColumn
      field="name"
      searchable
      sortable
      title="Имя"
    />
    <DataTableColumn
      field="balance"
      sortable
      text-align="right"
      title="Баланс"
    >
      <template #cell="{ item }">{{ item.balance.toFixed(2) }} ₽</template>
    </DataTableColumn>
  </DataTable>
  <p>Выбранные пользователи: {{ selectedNames.join(', ') }}</p>
  <button
    type="button"
    @click="clear"
  >
    Снять выбор
  </button>
</template>
```

Редактор получает тип `User` для `item` слота `cell`. Поэтому `item.balance`
известен как число, а обращение к отсутствующему полю является ошибкой типов.

## Где применяется тип записи

| Часть `API`        | Типизация                                  |
| ------------------ | ------------------------------------------ |
| `items`            | Массив записей `T`                         |
| Строковый `rowKey` | Строковый ключ типа `T`                    |
| Функция `rowKey`   | Принимает запись `T` и возвращает `RowKey` |
| `responseAdapter`  | Возвращает ответ с записями `T`            |
| `field` колонки    | Строковый ключ типа `T`                    |
| `value` колонки    | Принимает запись `T`                       |
| `cell.item`        | Запись `T`                                 |
| `rowClick`         | Поле `item` имеет тип `T`                  |
| `selectionChange`  | Поле `items` имеет тип `T[]`               |
| `requestSuccess`   | Ответ содержит записи `T`                  |

`sortField` остаётся произвольной строкой: серверное имя может отличаться от
поля записи. `key` колонки также не ограничен полями `T`; для действий допустим
`key="actions"`. Вычисляемое значение задаётся через `value`, а не через
несуществующий `field`.

## Ссылка на компонент и экспортируемые типы

`InstanceType<typeof DataTable>` сохраняет методы `reload(): Promise<void>`
и `clearSelection(): void`. Это относится к компоненту, полученному из фабрики.

Из корня экспортируются `TypedTable<T>`, `TypedDataTable<T>`,
`TypedDataTableColumn<T>`, `DataTableProps<T>`, `DataTableEmits<T>` и
`DataTableColumnSlots<T>`. Эти типы подходят для параметров обёрток приложения
и обработчиков событий.

## Ограничения

- Обычный импорт `DataTable` не выводит тип слота автоматически из `items`.
  Для единой схемы предназначена фабрика.
- Для одной таблицы используются компоненты одной типизированной пары.
  `Vue` не проверяет, что вложенная колонка получена именно из той же фабрики.
- Фабрика не проверяет `JSON` сервера. Преобразование и проверка `unknown`
  остаются обязанностью `responseAdapter`.
- Стабильные ключи, уникальность записей и допустимые значения проверяются
  во время выполнения независимо от `TypeScript`.
- Положительные и отрицательные примеры проверяются через `vue-tsc` в установленном
  архиве. Подсказки конкретной версии `WebStorm` требуют проверки в редакторе.

Подробности компонентов: [таблица](data-table.md), [колонки](data-table-column.md).
