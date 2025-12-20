# Переход с `1.x` на `2.0`

Версия `2.0` изменяет публичный `API` и требует `Vue ^3.5.0`. Приложения на
`Vue 2` используют ветку `1.x`. Новый пакет поставляется в формате `ESM`:
сборки `CommonJS` и `UMD` отсутствуют.

В текущем репозитории реализуется контракт `2.0`, но в `package.json` пока
указана версия `1.3.0-alpha.0`. Номер версии будет изменён при выпуске.
Обновление зависимости само по себе не переносит приложение на новый `API`.

Примеры старого кода отмечены языками `ts2` и `vue2`; они приведены только
для сравнения. Примеры нового `API` проверяются командой `npm run check:package`
на установленном архиве пакета.

## Таблица замен

| `API` `1.x` и прежних альфа-версий                                  | `API` `2.0`                                                       | Изменение                                         |
| ------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| `Vue 2`, `Vue.use`                                                  | `Vue ^3.5.0`, `app.use`                                           | Новое окружение                                   |
| `DataTable`, `DataTableColumn`, `VueDatatables182`                  | Те же экспорты                                                    | Сохранены                                         |
| `source`, `items`, `url`                                            | Те же параметры; для `remote` нужен `url`                         | Уточнены ограничения                              |
| `filters`                                                           | `filter`                                                          | Переименован                                      |
| `method`, `defaultMethod`                                           | `BuiltRequest.method` через `requestAdapter`; по умолчанию `POST` | Настройка через адаптер                           |
| `csrfToken`, `registerGlobally`                                     | Настройки плагина                                                 | Изоляция в пределах приложения                    |
| `searching`                                                         | `search`                                                          | Переименован                                      |
| `orderBy`, `orderDirection`; прежние `sortBy`, `sortDirection`      | `sort` / `defaultSort` с `{ by, direction }` или `null`           | `by` содержит ключ колонки                        |
| `rowsPerPageCount` как начальное значение                           | `defaultRowsPerPageCount`                                         | Начальное и управляемое значения разделены        |
| `pagination`, `rowsPerPageOptions`                                  | Те же параметры                                                   | Сохранены                                         |
| `showRangeInfo`                                                     | `showPageDetails`                                                 | Переименован                                      |
| `rowSelection`                                                      | `selection`                                                       | Переименован                                      |
| `disallowSelectAll`                                                 | `allowSelectAll`                                                  | Значение инвертируется                            |
| Массив выбранных объектов                                           | `selectedRowKeys` / `defaultSelectedRowKeys` и `rowKey`           | Выбор хранится по ключам                          |
| Параметр и слот `actions`                                           | `DataTableColumn` с ключом и слотом `cell`                        | Заменены обычной колонкой                         |
| `numbering`, `rowsClickable`, `selectOnRowClick`                    | Те же параметры                                                   | Сохранены                                         |
| `scrollX`, `stickyHeader`, `verticalBorders`                        | Те же параметры                                                   | Сохранены                                         |
| `fixedColumnsStart`, `fixedColumnsEnd`                              | `sticky` у конкретных колонок                                     | Изменена настройка закрепления                    |
| `field`, `title`, `width`, `textAlign`, `searchable` колонки        | Те же параметры                                                   | `field` и `title` необязательны                   |
| `orderable` колонки                                                 | `sortable`                                                        | Переименован                                      |
| Слот `cell` с `{ index, item, number }`; прежний вариант `{ item }` | `{ item, key, index, number }`                                    | Контекст расширен                                 |
| `topLeftBeforeActions`, `topLeftAfterActions`, `topRight`           | Те же слоты                                                       | Сохранены и дополнены параметрами                 |
| `update:selected-rows`                                              | `update:selectedRowKeys` и `selectionChange`                      | Ключи и записи передаются отдельно                |
| `row-click` с прежней оболочкой                                     | `rowClick` с `{ key, item }`                                      | Изменены данные события                           |
| `loading-start`, `loading-end`                                      | `requestStart`, `requestSuccess`, `requestError`, `requestEnd`    | Новый цикл событий запроса                        |
| Прежний `requestEnd` с `{ ok }`                                     | `{ requestId, status }`                                           | Изменены данные события                           |
| Прежний `requestSuccess` с данными напрямую                         | `{ requestId, data }`                                             | Изменены данные события                           |
| Прежний `requestError` с ошибкой напрямую                           | `{ requestId, error }`                                            | Изменены данные события                           |
| `reload`                                                            | `reload(): Promise<void>`                                         | Можно ожидать завершения, включая ошибку и отмену |
| `deselectAllRows`                                                   | `clearSelection`                                                  | Переименован                                      |
| Типы с префиксом `DT`                                               | Именованные типы из корня пакета                                  | Заменены                                          |
| `dist/index.css`                                                    | Тот же путь                                                       | Сохранён                                          |
| Декодирование `HTML`-сущностей в ячейках                            | Обычный текст; преобразование через `value` или `cell`            | Автоматическое преобразование удалено             |

Старые имена не сохраняются как псевдонимы. Полный контракт доступен в
справочниках [таблицы](data-table.md), [колонок](data-table-column.md),
[состояния](api-v2/state.md) и [HTTP-запросов](api-v2/remote.md).

## Регистрация компонентов

Регистрация в `Vue 2`:

```ts2
import Vue from 'vue'
import { VueDatatables182 } from 'vue-datatables-182'
Vue.use(VueDatatables182, { registerGlobally: true, defaultMethod: 'GET' })
```

Регистрация в `Vue 3`:

```ts
import { createApp } from 'vue'
import { VueDatatables182 } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'
import App from './App.vue'

createApp(App).use(VueDatatables182, { registerGlobally: true }).mount('#app')
```

Значение `registerGlobally` по умолчанию — `false`. При прямом импорте
`DataTable` и `DataTableColumn` установка плагина не требуется. Готовый файл
стилей подключается отдельным импортом.

Настройки адаптеров, сообщений и `CSRF` изолированы в пределах приложения.
При серверном рендеринге для каждого запроса создаётся отдельный экземпляр
приложения; конфигурация одного экземпляра не изменяет конфигурацию другого.

## Состояние, выбор строк и методы

Фрагмент старого шаблона:

```vue2
<data-table
  :items="users"
  :rows-per-page-count="10"
  order-by="name"
  order-direction="asc"
  row-selection
  searching
  source="local"
  @update:selected-rows="selectedRows = $event"
>
  <data-table-column field="name" orderable title="Имя" />
</data-table>
```

В новом примере таблица самостоятельно хранит страницу, поиск и сортировку,
а выбранные ключи передаются через `v-model:selected-row-keys`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DataTable,
  DataTableColumn,
  type RowKey,
  type SelectionChangePayload,
} from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

const users = [
  { id: 1, name: 'Анна' },
  { id: 2, name: 'Борис' },
]
const selectedKeys = ref<RowKey[]>([])
const selectedNames = ref<string[]>([])
const table = ref<InstanceType<typeof DataTable> | null>(null)

function selectionChanged({ items }: SelectionChangePayload) {
  selectedNames.value = items.map((item) => String(item.name))
}
async function refresh() {
  await table.value?.reload()
}
function clear() {
  table.value?.clearSelection()
}
</script>

<template>
  <button
    type="button"
    @click="refresh"
  >
    Обновить
  </button>
  <button
    type="button"
    @click="clear"
  >
    Снять выбор
  </button>
  <output aria-label="Выбранные имена">{{ selectedNames.join(', ') }}</output>
  <DataTable
    ref="table"
    v-model:selected-row-keys="selectedKeys"
    :default-rows-per-page-count="10"
    :default-sort="{ by: 'name', direction: 'asc' }"
    :items="users"
    row-key="id"
    selection
    source="local"
    @selection-change="selectionChanged"
  >
    <DataTableColumn
      key="name"
      field="name"
      title="Имя"
      searchable
      sortable
    />
  </DataTable>
</template>
```

### Начальные значения и управляемое состояние

`rowsPerPageCount` теперь задаёт состояние, управляемое родителем. Для начального
значения используется `defaultRowsPerPageCount`. Аналогично разделены
`page` и `defaultPage`, `searchQuery` и `defaultSearchQuery`, `sort` и
`defaultSort`, `selectedRowKeys` и `defaultSelectedRowKeys`.

Режим каждого поля определяется при монтировании. Если управляемый параметр
передан, последующее значение подтверждается родителем через соответствующее
событие `update:*`. Значение `sort=null` означает управляемое состояние без
сортировки. Параметры с префиксом `default` читаются один раз.

### Ключи и выбранные записи

Параметр `rowKey` обязателен. Он возвращает уникальную строку или конечное число;
индекс строки не подходит для стабильного выбора. В состоянии выбора хранятся
ключи, а не объекты записей. Событие `selectionChange` передаёт обе коллекции:
`keys` и `items`.

Выбор ограничен текущей страницей и очищается при изменении страницы, размера
страницы, поиска или сортировки. Перенос выбора между страницами в контракт
таблицы не входит.

### Методы экземпляра

Метод `reload()` возвращает `Promise<void>`. Завершение ожидания означает окончание
операции, включая ошибку или отмену. Ошибка запроса передаётся через `requestError`,
а не через отклонение результата `reload()`.

Метод `deselectAllRows` заменён на `clearSelection()`. В управляемом режиме
он отправляет `update:selectedRowKeys` с пустым массивом; родитель подтверждает
изменение состояния. Тип экземпляра выводится через
`InstanceType<typeof DataTable>`.

## Колонки действий, закрепление и значения

Прежние параметр `actions` и слот `actions` заменяются обычной колонкой
`DataTableColumn` с явным `key="actions"` и слотом `cell`. Для кнопок внутри
ячейки используется `@click.stop`, если нажатие не должно выбирать строку
или вызывать её обработчик. Пример находится в [справочнике колонок](data-table-column.md).

Параметры `fixedColumnsStart` и `fixedColumnsEnd` заменены настройками
`sticky="left"` и `sticky="right"` у конкретных колонок. Закреплённой колонке
нужна положительная фиксированная ширина в `px`; значения `%`, `auto`, `fr`
и выражения `calc()` для неё не подходят.

Колонки, определённые только через `value` или слот `cell`, требуют явного
непустого строкового `key`. Поле `sort.by` содержит ключ колонки. Если ключ
не задан, для колонки с `field="name"` он создаётся как `field:name`.
На сервер передаётся `sortField`, а при его отсутствии — `field`.

Слот `cell` получает `item`, `key`, `index` и `number`. Индекс `index`
начинается с нуля на текущей странице, а `number` учитывает пагинацию.
Функция `value` имеет приоритет над `field` для отображения, поиска и сортировки.
Слот `cell` заменяет только отображение: поиск и сортировка используют исходное
значение колонки.

`HTML`-сущности больше не декодируются автоматически. По умолчанию содержимое
ячейки выводится как обычный текст. Локальная сортировка поддерживает однородные
строки, конечные числа или логические значения; `null` и `undefined` остаются
в конце. Объекты и смешанные типы не поддерживаются.

## `HTTP`: переход на адаптеры

По умолчанию отправляется `POST` с телом `JSON`. Оно содержит `filter`,
а также включённые параметры страницы, поиска и сортировки. Если пагинация
отключена, поля `page` и `perPage` отсутствуют.

Прежняя настройка `defaultMethod='GET'` не переносится автоматически. Для сервера,
который принимает `GET`, параметры сериализуются в `URL` через `requestAdapter`:

```ts
import type { RequestAdapter } from 'vue-datatables-182'

export const getRequest: RequestAdapter = ({ url, requestBody }) => {
  const target = new URL(url, window.location.href)
  Object.entries(requestBody).forEach(([key, value]) => {
    if (value !== undefined) {
      target.searchParams.set(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value),
      )
    }
  })
  return { url: target.href, method: 'GET', credentials: 'same-origin' }
}
```

Функция `getRequest` передаётся параметру таблицы `requestAdapter` или настройкам
плагина. Доступ к `window` в этом примере выполняется внутри адаптера: удалённый
запрос начинается после монтирования компонента. Для запросов к другому источнику
настройки `credentials` и `headers` задаются явно. Автоматическое добавление
`csrfToken` выполняется только для `POST` к тому же источнику. Тела `FormData`
и произвольные `HTTP`-методы не поддерживаются.

Стандартный ответ содержит `items`, `total` и необязательный `filtered`.
Поле `total` обозначает общее количество записей, а `filtered` — количество
результатов после фильтрации. При отсутствии `filtered` используется `total`.
Оба счётчика — безопасные неотрицательные целые числа, причём `filtered <= total`.
При `pagination=false` сервер возвращает весь отфильтрованный набор.

Другой формат ответа преобразуется через `ResponseAdapter<Item>`. Входные данные
имеют тип `unknown`; проверка структуры серверного `JSON` остаётся необходимой.
Безусловное приведение типа не проверяет фактический ответ.
Подробные правила изложены в [контракте удалённых данных](api-v2/remote.md).

## События

| Прежнее событие                               | Новое событие и данные                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| `update:selected-rows` с объектами            | `update:selectedRowKeys` с ключами; `selectionChange` с `{ keys, items }`      |
| `row-click` с прежней оболочкой               | `rowClick` с `{ key, item }`                                                   |
| `loading-start`                               | `requestStart` с `{ requestId, request }`                                      |
| `loading-end`                                 | `requestEnd` с `{ requestId, status }`                                         |
| `requestSuccess(data)` в прежней альфа-версии | `requestSuccess({ requestId, data })`                                          |
| `requestError(error)` в прежней альфа-версии  | `requestError({ requestId, error })`                                           |
| `requestEnd({ ok })` в прежней альфа-версии   | `requestEnd({ requestId, status })`; статус — `success`, `error` или `aborted` |

В шаблонах имена обработчиков записываются через дефис: `@request-success`,
`@request-error`, `@request-end`, `@row-click`, `@selection-change`.
В `TypeScript` используются имена `requestSuccess`, `requestError` и другие
экспортируемые контракты событий.

Номер `requestId` увеличивается внутри экземпляра таблицы. Ошибка адаптера до
построения запроса не создаёт `requestStart`. Отмена завершает попытку через
`requestEnd` со статусом `aborted`. После размонтирования события не отправляются.
Локальный источник данных не создаёт событий `HTTP`-запросов.

## Типизация и импорты

Прежние типы с префиксом `DT` заменены именованными экспортами из корня пакета:
`PluginOptions`, `RowKey`, `Sort`, `RequestAdapter`, `ResponseAdapter`
и типами данных событий. Отдельного экспорта `DataTableMethods` нет.

Для строгой типизации записей используется [фабрика `createTypedTable<Item>()`](typed-table.md).
Она возвращает исходные компоненты с уточнёнными контрактами параметров, слотов
и событий, не добавляя обёрток во время выполнения. Обычные импорты сохраняют
общий тип `RowItem`.

Импорты старых файлов `dist/vue-datatables-182.es.js` и `dist/vue-datatables-182.umd.js`
заменены импортами из `vue-datatables-182`. Стили подключаются из
`vue-datatables-182/dist/index.css`.

## Оформление и слоты

Настройки `Sass`, применявшиеся при сборке, заменены публичными `CSS`-переменными.
Они задаются на корне таблицы или наследуются от родительского контейнера.
Полный список находится в [справочнике оформления](customization.md).

Слоты панели инструментов сохранены и получают `selectedCount`, `loading`,
`clearSelection` и `reload`. Старые слоты без параметров продолжают работать.
Слоты `search`, `rowsPerPage` и `pagination` заменяют соответствующие элементы
управления. Слот `header` меняет только содержимое заголовка колонки:
сортировка активируется отдельной кнопкой.

## Проверка перехода

1. Обновление `Vue` и сборщика до совместимого окружения `Vue 3` и `ESM`.
2. Замена параметров, событий и слотов по таблице миграции.
3. Проверка уникальности `rowKey`, начальных значений и счётчиков ответа.
4. Проверка загрузки, ошибки, повторного запроса, выбора и управляемого состояния.
5. Проверка подсказок параметров, слотов, событий и методов в `IDE`.
6. Сборка приложения с установленным архивом пакета.
7. Проверка прокрутки, закрепления и клавиатурного управления в поддерживаемых
   браузерах, включая ручную проверку `Firefox 84.0`.

Сценарии `Storybook` демонстрируют поведение компонентов, но интеграция с конкретным
сервером и приложением проверяется в самом приложении.
