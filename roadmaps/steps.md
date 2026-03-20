# Remaining Work — Plan

Оставшиеся задачи для подготовки к стабильному релизу v2.

---

## Phase 1: Критические исправления

### ⬜ 1.1. Заменить `onUpdated` на целевые `watch`
- Убрать `onUpdated` из `DataTable.vue`
- Добавить `watch` на каждую группу пропсов: pagination, search, sort, selection, items, url, filter, appearance
- Каждый watcher должен вызывать только нужные действия (normalize + apply, или только rebuild columns)
- Отдельный watcher для слотов (rebuild columns)

### ⬜ 1.2. Очистка при unmount (Remote Adapter)
- Добавить `onBeforeUnmount` в `DataTable.vue` или вернуть cleanup-функцию из `useRemoteAdapter`
- Отменять `inFlight` запрос при размонтировании
- Отменять debounced вызов в `useDataProvider`

### ⬜ 1.3. Исправить `allVisibleSelected`
- Изменить логику: проверять что **все** ключи видимых items содержатся в `selectedRowKeys`, а не сравнивать длины
- Использовать `selectedKeysSet` для O(1) проверки каждого видимого элемента

### ⬜ 1.4. Устранить мутацию пропсов VNode
- В `normalize-slot-result.ts` не мутировать `tableColumnProps` напрямую
- Создавать новый объект с нормализованными значениями
- Убрать `@ts-ignore`

---

## Phase 2: Тестирование

### ⬜ 2.1. Настроить тестовое окружение
- Проверить работоспособность Jest + vue-jest + @vue/test-utils
- Добавить `check:types` в CI pipeline
- Настроить coverage thresholds

### ⬜ 2.2. Unit-тесты Core
- `useCore`: setPage, setSort, setSearchQuery, setRowsPerPageCount, toggleRowItemSelection, selectAllRows, clearSelection
- `normalize`: валидация пропсов, clamp page, сброс sort при невалидной колонке, truncate selection по limit
- `setTableData`: reconciliation выбранных строк при смене данных
- Edge cases: пустые options, невалидные значения, граничные значения page

### ⬜ 2.3. Unit-тесты DataProvider
- `useLocalAdapter`: поиск, сортировка (ASC/DESC/clear), пагинация, комбинации
- `useRemoteAdapter`: формирование контекста, snapshot-дедупликация, abort in-flight, обработка ошибок
- `useDataProvider`: переключение source, debounce, reload vs apply

### ⬜ 2.4. Unit-тесты ColumnRegistry
- `useColumnRegistry`: rebuild, duplicate keys, sticky offset, numbering/selection columns
- `normalize-slot-result`: нормализация boolean props, fallback keys

### ⬜ 2.5. Unit-тесты Controller
- `useController`: sortClick toggle cycle, pageChange, searchInput, selectAllRows toggle
- UI computed: sortIndicators, canSelectAll, allVisibleSelected, isRowSelected

### ⬜ 2.6. Unit-тесты утилит
- `debounce`: таймер, cancel, immediate
- `decode-string`: все HTML-entities
- `build-grid-layout`: sticky offsets, grid template, error на отсутствие width
- `clampInt`, `makeRowKeySelector`, `formatSearchString`, `makeSnapshot`

### ⬜ 2.7. Компонентные тесты
- `DataTable.vue`: монтирование, пропсы, emit-события, slots
- `SearchField.vue`: ввод, clear, focus/blur
- `Paginator.vue`: навигация, disabled-состояния
- `CheckboxElement.vue`: состояния checked/indeterminate/unchecked

---

## Phase 3: Интернационализация (i18n)

### ⬜ 3.1. Вынести строки в конфигурацию
- Определить тип `Locale` с ключами для всех UI-строк
- Значения по умолчанию на английском
- Русская локаль как отдельный пресет

### ⬜ 3.2. Передача локали
- Добавить prop `locale` в `DataTable` (объект или строка-ключ)
- Альтернативно: настройка через plugin options (`defaultLocale`)
- Provide/inject для передачи вглубь дерева компонентов

### ⬜ 3.3. Обновить компоненты
- `SearchField.vue`: placeholder и label из локали
- `PageDetails.vue`: шаблон текста из локали, убрать hardcoded declension
- `RowsPerPageSelector.vue`: label из локали

---

## Phase 4: UI-состояния

### ⬜ 4.1. Компонент ErrorPlug
- Отображение ошибки при `core.error !== null`
- Кнопка "Повторить" → `dataProvider.reload()`
- Кастомизация через slot `error`

### ⬜ 4.2. Компонент NoDataPlug
- Отображение при `items.length === 0 && !isLoading && !error`
- Текст по умолчанию из локали
- Кастомизация через slot `empty`

### ⬜ 4.3. Интеграция в TableView/Root
- Условный рендеринг: error → ErrorPlug, empty → NoDataPlug, data → TableBody

---

## Phase 5: Layout (стили и вёрстка)

Слой layout не готов — требуется комплексная доработка стилей, проверка отображения и реализация недостающих визуальных компонентов.

### ⬜ 5.1. Чистка существующего CSS
- Удалить пустые `<style>` блоки (`Root.vue`, `TableView.vue`, `BodyCellData.vue`, `BodyCellNumbering.vue`, `DataTable.vue`)
- Убрать `!important` на SVG-иконках в `SearchField.vue`
- Удалить мёртвый CSS (`td.dt182-sticky-end` в `TableRow.vue`)
- Устранить конфликт `display: flex` / `display: grid` в `TableRow.vue`

### ⬜ 5.2. Оптимизация shimmer-анимации
- Рендерить `.dt182-cell-loader` только при `loading === true` (`v-if` вместо `visibility`)
- Или использовать `animation-play-state: paused` когда не visible

### ⬜ 5.3. Реализация striped rows
- Реализовать CSS для prop `striped` (prop принимается, стили отсутствуют)
- `nth-child(even/odd)` стили для строк

### ⬜ 5.4. Border-radius таблицы
- Добавить border-radius на контейнер таблицы
- Обработать overflow для sticky-колонок

### ⬜ 5.5. Проверка и доработка визуальных сценариев
- scrollX + sticky columns
- stickyHeader + scrollY
- verticalBorders + sticky columns
- numbering + selection + sticky + scrollX (все вместе)
- loading skeleton при разных ширинах колонок
- Разные размеры экранов / контейнеров
- Пограничные случаи: одна колонка, очень длинный текст, 0 строк, 1000+ строк

### ⬜ 5.6. Стили Toolbar и Pagination контейнеров
- Проверить и довести до продакшн-качества стили `Toolbar.vue`, `Pagination.vue`, `Wrapper.vue`
- Убедиться в корректном поведении при overflow контента

### ⬜ 5.7. Стили контролов
- `SearchField.vue`: проверить анимацию раскрытия, стили фокуса
- `Paginator.vue`: проверить стили при большом количестве страниц
- `RowsPerPageSelector.vue`: проверить стили select-элемента
- `PageDetails.vue`: проверить отображение при длинных числах

---

## Phase 6: Accessibility (a11y)

### ⬜ 6.1. ARIA-атрибуты
- Таблица: `role="table"`, строки: `role="row"`, ячейки: `role="cell"` / `role="columnheader"`
- Сортируемые заголовки: `aria-sort="ascending|descending|none"`
- Checkbox: `role="checkbox"`, `aria-checked`, `aria-label`
- Пагинация: `role="navigation"`, `aria-label` на кнопках ("Первая страница", "Следующая" и т.д.)
- Поиск: `role="search"` на обёртке, `aria-label` на input

### ⬜ 6.2. Keyboard navigation
- Checkbox: обработка Enter и Space
- Пагинация: Tab-навигация, Enter для активации
- Сортировка: Enter на заголовке
- `tabindex` на интерактивных div-ах

---

## Phase 7: Сборка и инфраструктура

### ⬜ 7.1. Добавить `files` в package.json
- Ограничить публикацию: `["dist", "README.md", "LICENSE"]`
- Проверить что `npm pack` не включает playground, docs, roadmaps

### ⬜ 7.2. Обновить CI
- Добавить `npm run check:types` в pipeline
- Обновить Node до v20
- Добавить step для проверки размера бандла

### ⬜ 7.3. Ревизия зависимостей
- Убрать `babel-core` bridge если не нужен
- Проверить необходимость `@types/vue`
- Убедиться что `vue-jest` корректно работает с текущей конфигурацией

---

## Phase 8: API и документация

### ⬜ 8.1. Документация API
- Props: описание, типы, defaults для DataTable и DataTableColumn
- Events: все emit-события с payload types
- Slots: список слотов с описанием scope
- Plugin options: полный список с примерами
- Adapter patterns: примеры requestAdapter / responseAdapter

### ⬜ 8.2. Примеры использования
- Базовый (local source)
- Remote с кастомными адаптерами
- Selection с лимитом
- Sticky columns
- Custom cell slots

### ⬜ 8.3. Changelog
- Описать breaking changes v1 → v2 (включая прекращение поддержки GET-метода)
- Обновить migration-guide.md

---

## Phase 9: Финальная верификация

### ⬜ 9.1. Полный цикл проверки
- `npm run check:code` без ошибок
- Coverage > 80%
- Playground проверен вручную для всех сценариев
- Bundle size проверен и задокументирован

### ⬜ 9.2. Пре-релизное тестирование
- `npm pack` → установка в тестовый проект
- Проверка UMD и ES module entry points
- Проверка CSS-экстракции
- Проверка TypeScript definitions (.d.ts)
