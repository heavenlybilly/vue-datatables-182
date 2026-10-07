# vue-datatables-182

Библиотека таблиц для `Vue 3` с локальными и удалёнными данными. Поддерживаются
поиск, сортировка, пагинация, выбор строк, закрепление колонок и заголовка,
настройка оформления и типизация через `TypeScript`.

Документация описывает `API 2.0`. Версия в текущем репозитории —
`1.3.0-alpha.0`; выпуск `2.0` ещё не опубликован. Примеры предназначены для
нового `API` и не совместимы с `1.x` без [миграции](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/migration-guide.md).

## Требования

- `Vue ^3.5.0`.
- Сборщик с поддержкой `ESM`, например `Vite` или `Webpack 5` с обработкой `Vue`-компонентов.
- `TypeScript 5.5` или новее при использовании статической типизации.
- `Firefox 84.0` или новее; остальные браузеры указаны в [матрице совместимости](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2.md#совместимость).

`JavaScript`, стили и декларации типов поставляются отдельно. Единственная внешняя
зависимость выполняемого кода — `Vue`. Полифилы браузерных `API` автоматически
не подключаются.

## Установка и подключение

Для установки опубликованной версии используется:

```sh
npm install vue-datatables-182
```

Команда устанавливает версию из канала `latest`. Предварительные выпуски
устанавливаются по опубликованному номеру версии или каналу `alpha`.
Перед использованием примеров требуется проверить соответствие установленной
версии `API 2.0`.

Компоненты импортируются из корня пакета. Стили подключаются явно:

```ts
import { DataTable, DataTableColumn } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'
```

Старые пути к файлам `.umd.js` и `.es.js` не поддерживаются в `2.0`.
Декларации из `dist/index.d.ts` доступны редактору автоматически.

## Устройство интерфейса

![Области таблицы, слоты и элементы управления](https://raw.githubusercontent.com/heavenlybilly/vue-datatables-182/dev/docs/ui-highlight.svg)

`DataTable` управляет данными, состоянием и элементами интерфейса.
`DataTableColumn` описывает колонку: источник значения, ширину, сортировку
и отображение ячеек. Колонки объявляются в основном слоте таблицы.

Верхняя панель содержит поиск и пользовательские действия. Нижняя панель
показывает размер страницы, диапазон записей и пагинацию. Слоты `loading`,
`empty`, `noResults` и `error` заменяют область данных. Действия строки
оформляются обычной колонкой со слотом `cell`.

## Таблица с локальными данными

Режим `source="local"` использует массив `items`. Поиск, сортировка и пагинация
выполняются в браузере без изменения исходного массива.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { type SelectionChangePayload, createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

type User = {
  id: number
  name: string
  department: string
  balance: number
}

const { DataTable, DataTableColumn } = createTypedTable<User>()
const selectedCount = ref(0)
const openedId = ref<number | null>(null)
const users: User[] = [
  { id: 1, name: 'Анна', department: 'Продажи', balance: 12500 },
  { id: 2, name: 'Борис', department: 'Поддержка', balance: 8400 },
  { id: 3, name: 'Вера', department: 'Продажи', balance: 19200 },
]

function onSelection({ keys }: SelectionChangePayload<User>) {
  selectedCount.value = keys.length
}
</script>

<template>
  <DataTable
    :default-rows-per-page-count="10"
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
      field="department"
      searchable
      title="Отдел"
    />
    <DataTableColumn
      field="balance"
      sortable
      text-align="right"
      title="Баланс"
    >
      <template #cell="{ item }">{{ item.balance.toFixed(2) }} ₽</template>
    </DataTableColumn>
    <DataTableColumn
      key="actions"
      title="Действия"
      width="140px"
    >
      <template #cell="{ item }">
        <button
          type="button"
          @click.stop="openedId = item.id"
        >
          Открыть
        </button>
      </template>
    </DataTableColumn>
    <template #topRight>Выбрано записей: {{ selectedCount }}</template>
  </DataTable>
  <output v-if="openedId !== null">Открыта запись № {{ openedId }}</output>
</template>
```

Параметр `rowKey` обязателен. Каждая запись должна иметь уникальный строковый
или конечный числовой ключ. Индекс массива не используется как запасной ключ.

`searchable` включает колонку в локальный поиск. `sortable` разрешает сортировку
отдельной кнопкой в заголовке. Слот `cell` меняет отображение, но не значение,
используемое для поиска и сортировки.

Выбор ограничен текущей страницей. По умолчанию `selectionLimit` равен `1000`.
Фабрика `createTypedTable<User>()` связывает тип строки с параметрами, событиями
и слотами обоих компонентов. Подробности — в [руководстве по типизации](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/typed-table.md).

## Таблица с удалёнными данными

Режим `source="remote"` загружает данные с сервера и используется по умолчанию.
В этом режиме обязателен непустой `url`; переданный `items` не заменяет ответ сервера.

```vue
<script setup lang="ts">
import { createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

type User = {
  id: number
  name: string
}

const { DataTable, DataTableColumn } = createTypedTable<User>()
</script>

<template>
  <DataTable
    row-key="id"
    source="remote"
    url="/api/users"
  >
    <DataTableColumn
      field="name"
      sortable
      title="Имя"
    />
    <template #error="{ retry }">
      <p>Данные не удалось загрузить.</p>
      <button
        type="button"
        @click="retry"
      >
        Повторить запрос
      </button>
    </template>
  </DataTable>
</template>
```

Стандартный адаптер отправляет `POST` с `JSON`-телом. Запрос содержит `page`,
`perPage`, `filter`, а при необходимости — `search`, `sortBy` и `sortDirection`.
Изменение поиска отправляет запрос после задержки `300 мс`.

Ответ содержит записи текущей страницы:

```json
{
  "items": [{ "id": 1, "name": "Анна" }],
  "total": 100,
  "filtered": 40
}
```

`total` — количество записей до фильтрации, `filtered` — после неё. Если
`filtered` отсутствует, используется `total`. При `pagination=false` ответ
должен содержать весь отфильтрованный набор.

Для `GET` и другой структуры ответа предусмотрены `requestAdapter` и
`responseAdapter`. Сервер определяет, по каким полям выполняется удалённый
поиск. Подробности — в [контракте удалённых данных](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2/remote.md).

## Загрузка, пустые результаты и ошибки

При первичной загрузке отображается отдельное состояние `loading`. Если записи
уже загружены, их строки сохраняют размеры, но содержимое ячеек временно
скрывается за анимированными полосами загрузки. Пользовательский слот `loading`
заменяет всю область строк даже при наличии прежних записей.

`empty` означает отсутствие записей в источнике. `noResults` означает, что
источник содержит записи, но текущему запросу ничего не соответствует.
Стандартное состояние `noResults` предлагает очистить непустой поисковый запрос.

При ошибке прежние строки скрываются; отображается `error` с возможностью
повторного запроса. Во время загрузки выбор строк и действие по клику на строку
недоступны. Фоновое обновление без скрытия ячеек и встроенный поллинг пока не предусмотрены.

## Управление состоянием

Для начальных значений используются `defaultPage`, `defaultRowsPerPageCount`,
`defaultSearchQuery`, `defaultSort` и `defaultSelectedRowKeys`. После создания
таблицы эти параметры повторно не читаются.

Для управления из родительского компонента используются соответствующие модели:
`v-model:page`, `v-model:rows-per-page-count`, `v-model:search-query`,
`v-model:sort` и `v-model:selected-row-keys`.

Режим определяется независимо для каждого поля при создании компонента.
Переданное значение, отличное от `undefined`, включает управляемый режим.
Для сортировки `null` означает отсутствие активной сортировки в управляемом режиме.

`sort` имеет вид `{ by: columnKey, direction: 'asc' | 'desc' } | null`.
Методы экземпляра: `reload(): Promise<void>` и `clearSelection(): void`.
Пример моделей и ссылки на компонент приведён в [справочнике таблицы](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/data-table.md).

## Оформление

Оформление задаётся `CSS`-переменными на `DataTable` или его родительском элементе.
Фон корневого контейнера прозрачен по умолчанию; обычные ячейки имеют белый фон.
Параметр `density` выбирает плотность: `comfortable` или `compact`.

```css
.orders-table {
  --dt182-checkbox-color: #48642d;
  --dt182-focus-color: #48642d;
  --dt182-row-selected-background: #edf4e5;
  --dt182-border-radius: 0.25rem;
}
```

Класс подключается как `class="orders-table"`. Слоты `header`, `cell`, `search`,
`rowsPerPage` и `pagination` позволяют заменить соответствующие части интерфейса.
Все переменные и ограничения описаны в [руководстве по кастомизации](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/customization.md).

## Общая конфигурация приложения

Прямые импорты компонентов работают без плагина. Плагин `VueDatatables182`
задаёт общие сообщения, адаптеры и `CSRF`-токен. Глобальная регистрация включается
через `registerGlobally: true`:

```ts
import { createApp } from 'vue'
import { VueDatatables182 } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'
import App from './App.vue'

createApp(App).use(VueDatatables182, { registerGlobally: true }).mount('#app')
```

По умолчанию `registerGlobally=false`. Конфигурация изолирована в пределах
приложения. Параметры таблицы имеют приоритет над настройками плагина.

## Документация

| Руководство                                                                                            | Содержание                                                |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [Таблица](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/data-table.md)             | Параметры, слоты, события, методы и сообщения             |
| [Колонки](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/data-table-column.md)      | Значения, ключи, отображение и закрепление                |
| [Типизация](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/typed-table.md)          | Фабрика `createTypedTable<T>()` и ограничения типов       |
| [Оформление](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/customization.md)       | `CSS`-переменные, плотность и внешние элементы управления |
| [Состояние](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2/state.md)         | Управляемый и автономный режимы, нормализация и переходы  |
| [Удалённые данные](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2/remote.md) | Запросы, ответы, адаптеры и обработка ошибок              |
| [Миграция](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/migration-guide.md)       | Переход с `1.x` на `2.0`                                  |
| [Storybook](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/storybook.md)            | Сценарии и ручная проверка браузеров                      |
| [Публичный контракт](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2.md)      | Совместимость и экспортируемые значения                   |

## Ограничения и производительность

В `2.0` не входят виртуализация, выбор между страницами, множественная сортировка,
встроенный экспорт, редактирование ячеек и группировка строк.

Для больших наборов данных предпочтительны серверная обработка и пагинация.
Количество локальных записей и сложность слотов влияют на скорость поиска,
сортировки и отрисовки. Ориентир для первоначальных измерений — до `10 000`
простых записей с пагинацией; это не гарантированный предел производительности.

При серверном рендеринге локальные строки доступны сразу. Удалённая загрузка
начинается после подключения компонента в браузере. Подробнее — в [контракте](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/api-v2.md).

## Разработка и проверка пакета

Среда разработки: `Node.js 24`. Зависимости устанавливаются через `npm ci`.

| Команда                   | Назначение                                                                  |
| ------------------------- | --------------------------------------------------------------------------- |
| `npm run storybook`       | Запуск сценариев по адресу `http://localhost:6006`                          |
| `npm run check:code`      | Проверка типов, тестов, `JavaScript`/`TypeScript` и стилей                  |
| `npm run build`           | Сборка `JavaScript`, `CSS` и деклараций в `dist`                            |
| `npm pack`                | Сборка и создание архива `npm`-пакета                                       |
| `npm run check:package`   | Проверка установленного архива, примеров, сборщиков и серверного рендеринга |
| `npm run build:storybook` | Сборка статического каталога в `storybook-static`                           |
| `npm run test:storybook`  | Выполнение браузерных сценариев в `Chromium`                                |
| `npm run test:release`    | Проверка правил версии, тега и архива                                       |
| `npm run benchmark:local` | Измерения локальной обработки и отрисовки в `jsdom`                         |

`check:package` не запускает сервер для просмотра в браузере. Перед запуском
браузерных тестов устанавливается `Chromium` командой `npx playwright install chromium`.
Порядок выпуска и оставшиеся проверки описаны в [плане релиза](https://github.com/heavenlybilly/vue-datatables-182/blob/dev/docs/major-release-plan.md).

Порядок публикации по тегу: [настройка GitHub и npm](docs/publishing.md).
