# Оформление и кастомизация

Стили подключаются через `vue-datatables-182/dist/index.css`.
Класс и `style`, заданные на `DataTable`, применяются к корневому элементу `.dt182`.
Оформление можно задавать на этом элементе либо наследовать от родителя.

Значения по умолчанию находятся в резервном аргументе `var()`. Таблица не
перекрывает унаследованные `CSS`-переменные. Компиляция `Sass` в приложении не требуется.

## Фон и наследование темы

`--dt182-background` задаёт фон корня и обычных ячеек. Если переменная не задана,
корень прозрачен и показывает фон приложения, а обычные ячейки имеют белый фон.
Для закреплённых ячеек используется `--dt182-sticky-background` с резервным
значением `--dt182-background`, затем белым цветом.

Отдельные состояния строки имеют собственные переменные: чередование,
наведение, выбор и наведение на выбранную строку. Это позволяет сохранить
читаемость закреплённых ячеек при прокрутке.

## Пример темы

```vue
<script setup lang="ts">
import { createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

const { DataTable, DataTableColumn } = createTypedTable<{
  id: number
  name: string
}>()

const items = [{ id: 1, name: 'Проект Альфа' }]
</script>

<template>
  <DataTable
    class="orders-table"
    density="compact"
    :items="items"
    row-key="id"
    selection
    source="local"
  >
    <DataTableColumn
      field="name"
      sortable
      text-overflow="ellipsis"
      title="Проект"
    />
    <template #topRight="{ selectedCount, clearSelection }">
      <button
        :disabled="!selectedCount"
        type="button"
        @click="clearSelection"
      >
        Снять выбор ({{ selectedCount }})
      </button>
    </template>
  </DataTable>
</template>

<style>
.orders-table {
  --dt182-checkbox-color: #48642d;
  --dt182-focus-color: #48642d;
  --dt182-row-selected-background: #edf4e5;
  --dt182-row-selected-hover-background: #e1edd3;
  --dt182-border-radius: 0.25rem;
}
</style>
```

Изменение переменной на родителе распространяется на вложенные таблицы.
Переопределение на конкретной таблице действует только в её области.
Стили дочерних пользовательских компонентов могут использовать те же переменные.

## `CSS`-переменные

В первой колонке указано полное имя CSS-переменной. Значения задаются
на корне таблицы или наследуются от родительского контейнера.

| Переменная                              | Значение по умолчанию                | Назначение                                             |
| --------------------------------------- | ------------------------------------ | ------------------------------------------------------ |
| `--dt182-background`                    | `transparent` / `#fff`               | корень / обычные ячейки                                |
| `--dt182-text-color`                    | `#243041`                            | основной текст                                         |
| `--dt182-muted-color`                   | `#596579`                            | подсказка поиска, диапазон и состояния                 |
| `--dt182-border-color`                  | `#dce2e9`                            | границы таблицы и элементов управления                 |
| `--dt182-font-family`                   | `inherit`                            | семейство шрифта                                       |
| `--dt182-font-size`                     | `0.875rem`                           | общий размер текста                                    |
| `--dt182-border-radius`                 | `0.375rem`                           | скругление таблицы и элементов управления              |
| `--dt182-panel-gap`                     | `0.75rem`                            | промежутки панелей                                     |
| `--dt182-cell-padding-block`            | `0.625rem` / `0.375rem`              | плотность `comfortable` / `compact`                    |
| `--dt182-cell-padding-inline`           | `0.75rem`                            | горизонтальные отступы ячеек                           |
| `--dt182-control-height`                | `2.25rem` / `2rem`                   | плотность `comfortable` / `compact`                    |
| `--dt182-header-background`             | `#f3f5f8`                            | заголовок                                              |
| `--dt182-header-hover-background`       | `#e7ecf3`                            | наведение на кнопку сортировки                         |
| `--dt182-sort-button-width`             | `2rem`                               | ширина кнопки сортировки                               |
| `--dt182-sort-color`                    | `currentColor`                       | цвет сортировки                                        |
| `--dt182-sticky-background`             | `var(--dt182-background, #fff)`      | фон обычных закреплённых ячеек                         |
| `--dt182-sticky-divider-color`          | `var(--dt182-border-color, #dce2e9)` | внешняя граница закреплённой группы                    |
| `--dt182-row-striped-background`        | `#f8fafc`                            | полосатые строки                                       |
| `--dt182-row-hover-background`          | `#edf3fc`                            | наведение и фокус внутри строки                        |
| `--dt182-row-selected-background`       | `#e2ecfc`                            | выбранная строка                                       |
| `--dt182-row-selected-hover-background` | `#d5e4fa`                            | выбранная строка с наведением или фокус                |
| `--dt182-control-background`            | `#fff`                               | поиск, список размеров, пагинация и действия состояний |
| `--dt182-control-hover-background`      | `#edf3fc`                            | наведение на кнопку пагинации                          |
| `--dt182-page-active-background`        | `#e2ecfc`                            | текущая страница                                       |
| `--dt182-disabled-color`                | `#8390a3`                            | текст недоступных кнопок пагинации                     |
| `--dt182-search-width`                  | `15rem`                              | ширина поиска, ограниченная контейнером                |
| `--dt182-focus-color`                   | `#2457c5`                            | клавиатурный фокус встроенных элементов управления     |
| `--dt182-checkbox-size`                 | `0.875rem`                           | размер изображения флажка                              |
| `--dt182-checkbox-color`                | `#2457c5`                            | фон выбранного и частично выбранного флажка            |
| `--dt182-checkbox-border-color`         | `#8390a3`                            | граница невыбранного флажка                            |
| `--dt182-checkbox-mark-color`           | `#fff`                               | цвет галочки и линии частичного выбора                 |
| `--dt182-checkbox-stroke-width`         | `1px`                                | толщина галочки и линии                                |
| `--dt182-skeleton-background`           | `#edf0f4`                            | фон полос загрузки                                     |
| `--dt182-skeleton-highlight`            | `#f8f9fb`                            | светлая часть полос загрузки                           |
| `--dt182-error-background`              | `#fffbfb`                            | фон ошибки                                             |
| `--dt182-error-color`                   | `#af3a3a`                            | текст ошибки                                           |
| `--dt182-transition-duration`           | `150ms`                              | длительность переходов                                 |

`--dt182-cell-padding-block` и `--dt182-control-height`, заданные явно, имеют приоритет над
`density`. Высота элементов управления минимальная: при увеличении текста
они могут расти. Плотность `comfortable` используется по умолчанию,
`compact` уменьшает вертикальные отступы и высоту.

Переменные `--dt182-density-*` и `--dt182-viewport-width` служебные и не входят
в публичный `API`. Их прямое переопределение не поддерживается.

## Тёмная тема

Для тёмной темы требуется согласовать не только фон и текст, но также
заголовок, границы, элементы управления, выбранные строки, наведение,
недоступные кнопки, полосы загрузки и состояние ошибки.

```css
.dark-table {
  --dt182-background: #17212e;
  --dt182-text-color: #e8edf5;
  --dt182-muted-color: #b3bfd0;
  --dt182-border-color: #435166;
  --dt182-header-background: #243247;
  --dt182-header-hover-background: #354662;
  --dt182-control-background: #17212e;
  --dt182-control-hover-background: #354662;
  --dt182-page-active-background: #354662;
  --dt182-row-striped-background: #1c293b;
  --dt182-row-hover-background: #293a52;
  --dt182-row-selected-background: #314967;
  --dt182-row-selected-hover-background: #3b5677;
  --dt182-checkbox-color: #91b5ff;
  --dt182-checkbox-mark-color: #17212e;
  --dt182-checkbox-border-color: #a7b5ca;
  --dt182-focus-color: #91b5ff;
  --dt182-disabled-color: #8c99ab;
  --dt182-skeleton-background: #243247;
  --dt182-skeleton-highlight: #354662;
  --dt182-error-background: #39212a;
  --dt182-error-color: #ffb6c2;

  color-scheme: dark;
}
```

Рабочий пример находится в `Storybook` → «Оформление и кастомизация» → «Тёмная тема».
Автоматическая смена темы не встроена: приложение меняет класс или переменные.

## Поведение элементов

### Сортировка и заголовок

Сортировку запускает отдельная кнопка справа. Она занимает всю высоту заголовка,
а ширина задаётся `--dt182-sort-button-width`. Текст заголовка и слот `header`
не сортируют при нажатии. Клавиатурный фокус кнопки расположен внутри её границ.

### Флажок выбора

Флажок остаётся нативным `input[type="checkbox"]`. При размере корневого
шрифта `16px` область взаимодействия равна `24 × 24px`, а изображение меньше.

`--dt182-checkbox-size` управляет размером изображения,
`--dt182-checkbox-stroke-width` — толщиной галочки и линии частичного выбора.
`--dt182-checkbox-color` задаёт выбранный фон, `--dt182-checkbox-mark-color` —
цвет отметки. Изображение не перехватывает нажатия.
В режиме принудительных системных цветов используется нативный вид.

### Поиск, панели и строки

Поиск имеет постоянную ширину и не расширяется при наведении.
При фокусе граница меняет цвет на `--dt182-focus-color`, без `outline`.
Панели и пагинация переносят элементы при недостатке места.
Горизонтальная прокрутка строк включается через `scrollX`.

Фон выбранной строки имеет приоритет над чередованием и обычным наведением.
Закреплённые ячейки выбранной строки используют тот же цвет.

### Длинный текст и закрепление

Для `ellipsis` требуется ограниченная ширина колонки. Полный стандартный текст
доступен через нативную подсказку `title`; для слота `cell` подсказка задаётся приложением.

Сумма ширин закреплённых групп должна оставлять место обычным колонкам.
Для узких контейнеров используются меньшие группы либо реактивное отключение `sticky`.
Автоматическое снятие закрепления не выполняется.

## Внешние элементы управления

Слоты `search`, `rowsPerPage` и `pagination` получают текущее значение и
обработчики изменения. Это позволяет использовать элементы дизайн-системы
приложения без повторной реализации нормализации таблицы.

```vue
<script setup lang="ts">
import { createTypedTable } from 'vue-datatables-182'
import 'vue-datatables-182/dist/index.css'

const { DataTable, DataTableColumn } = createTypedTable<{
  id: number
  name: string
}>()
const items = [
  { id: 1, name: 'Анна' },
  { id: 2, name: 'Борис' },
]
</script>

<template>
  <DataTable
    :default-rows-per-page-count="1"
    :items="items"
    row-key="id"
    source="local"
  >
    <DataTableColumn
      field="name"
      searchable
      title="Имя"
    />
    <template #search="{ value, setValue }">
      <input
        aria-label="Поиск пользователей"
        :value="value"
        @input="setValue(($event.target as HTMLInputElement).value)"
      />
    </template>
    <template #pagination="{ page, pageCount, setPage }">
      <button
        :disabled="page <= 1"
        type="button"
        @click="setPage(page - 1)"
      >
        Назад
      </button>
      <span>Страница {{ page }} из {{ pageCount }}</span>
      <button
        :disabled="page >= pageCount"
        type="button"
        @click="setPage(page + 1)"
      >
        Вперёд
      </button>
    </template>
  </DataTable>
</template>
```

Оформление, доступные подписи, фокус и недоступные состояния внешних элементов
задаются приложением. При `pageCount=0` навигационные действия должны быть недоступны.
Полный список данных слотов находится в [справочнике таблицы](data-table.md#слоты).

## Стабильные `CSS`-классы

Для дополнительного оформления доступны `.dt182`, `.dt182-top`, `.dt182-bottom`,
`.dt182-table-viewport`, `.dt182-table`, `.dt182-column`, `.dt182-cell`,
`.dt182-cell-content`, `.dt182-row--selected`, `.dt182-row--striped`,
`.dt182-sort-column-btn`, `.dt182-checkbox-element`, `.dt182-checkbox-icon`,
`.dt182-search`, `.dt182-paginator` и `.dt182-data-state`.

Собственный класс `DataTableColumn` применяется к заголовку и ячейкам колонки.
Предпочтительны `CSS`-переменные и явные классы: привязка к номеру `DOM`-узла
зависит от порядка колонок и служебных элементов.

В стилях с `scoped` переменные задаются на самом `DataTable`. Для доступа к
внутреннему классу используется `:deep()`. Более специфичные правила приложения
могут переопределить оформление библиотеки.

## Доступность и совместимость

Общие правила библиотеки не оформляют кнопки и поля пользовательских слотов.
Встроенные элементы сохраняют нативное клавиатурное управление.
`Firefox 84` использует резервное оформление через `:focus` и `:focus-within`.
При `prefers-reduced-motion` анимация загрузки и переходы отключаются.
Ручная проверка описана в [руководстве Storybook](storybook.md).
