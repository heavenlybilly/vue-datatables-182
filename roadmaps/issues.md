# Issues & Weaknesses

Результат аудита кодовой базы vue-datatables-182 v1.3.0-alpha.0.

_Использовать_ ✅ _для отметки о выполнении_.

---

## 1. Критические проблемы

### ⬜ 1.1. Отсутствие тестов

Тесты полностью отсутствуют. Jest настроен, `@vue/test-utils` установлен, CI запускает `npm test` — но ни одного .spec/.test файла нет. Любой рефакторинг или новая фича несёт риск регрессий без обратной связи.

### ⬜ 1.2. `onUpdated` вместо целевых `watch`

`DataTable.vue:184-187` — `onUpdated` вызывает `rebuildColumns()` + `core.normalize()` + `dataProvider.apply()` на **каждый** ре-рендер родительского компонента, даже если пропсы таблицы не изменились. Это приводит к:
- избыточным вычислениям нормализации и rebuild колонок;
- потенциальным лишним HTTP-запросам (remote-режим), если debounce не спасает;
- скрытым побочным эффектам при любом обновлении дерева компонентов.

**Решение**: заменить `onUpdated` на точечные `watch` по конкретным пропсам.

### ⬜ 1.3. Нет очистки при unmount (Remote Adapter)

`useRemoteAdapter.ts` — при уничтожении компонента in-flight запрос (`inFlight: AbortController`) не отменяется. Если компонент размонтируется до ответа сервера:
- `core.setTableData(data)` вызывается на несуществующем состоянии;
- `core.setLoading(false)` в `finally` может вызвать предупреждение Vue о работе с unmounted reactive state;
- утечка ресурсов при частом mount/unmount (роутинг, табы).

**Решение**: `onBeforeUnmount(() => inFlight?.abort())`.

### ⬜ 1.4. Мутация пропсов VNode в `normalize-slot-result.ts`

Строки 22-30 — напрямую мутируются `tableColumnProps.searchable` и `tableColumnProps.sortable` (с `''` на `true`). Это мутация `propsData` VNode, что нарушает контракт Vue. Подавлено через `@ts-ignore`.

**Риск**: непредсказуемое поведение при переиспользовании VNode-ов Vue.

### ⬜ 1.5. Логика `allVisibleSelected` ложно-положительная

`useController.ts:43-45` — сравнивает **длину** `selectedRowKeys` с **длиной** `tableData.items`. Если выбрано N элементов с одной страницы, а на другой странице тоже N элементов — checkbox в шапке покажет "все выбраны", хотя выбраны элементы с другой страницы.

**Решение**: сравнивать не длины, а проверять что **все** ключи текущих видимых items присутствуют в `selectedRowKeys`.

---

## 2. Архитектурные проблемы

### ⬜ 2.1. `buildGridLayout` вызывается каждый рендер

`TableView.vue:22-24` — `buildGridLayout` внутри `computed`, но зависит от `controller.columns` и `controller.appearance.isScrollXEnabled()`. При каждом обновлении `controller` (а он зависит от `core.state`) — пересчёт layout. Можно мемоизировать по columns snapshot + scrollX.

### ⬜ 2.2. Дублирование pageCount в Paginator

`Paginator.vue:18-20` — `countPages` вычисляется заново из `itemsCount / rowsPerPage`, хотя `core.pageCount` уже содержит это значение. Потенциальное расхождение логики.

### ⬜ 2.3. Дублирование rangeInfo в PageDetails

`PageDetails.vue:12-22` — `numberStart`/`numberEnd` вычисляются заново, хотя `core.rangeInfo` уже содержит `from/to/total`. Аналогично п.2.4.

### ⬜ 2.4. Инициализация обоих адаптеров

`useDataProvider.ts:22-36` — **всегда** создаются и `useLocalAdapter`, и `useRemoteAdapter`, независимо от `source`. Лишнее создание замыканий и объектов для неиспользуемого адаптера.

---

## 3. Безопасность

### ⬜ 3.1. v-html со статическими SVG — допустимый риск

`SearchField.vue:64`, `Paginator.vue:86-116`, `HeaderCellData.vue:67` — используют `v-html` для рендера SVG-иконок. Иконки импортируются как строки из `/assets/` через `rollup-plugin-string` — это **статические** данные, XSS-риск отсутствует.

### ⬜ 3.2. Отсутствие валидации ответа сервера

`useRemoteAdapter.ts:99-106` — `response.json()` парсится, а затем передаётся в `responseAdapter` без валидации. Если `responseAdapter` не валидирует (а это на совести пользователя), некорректный ответ может привести к runtime-ошибкам в `setTableData`.

### ⬜ 3.3. `RowValue = any` ослабляет типизацию

`types.ts:51` — `type RowValue = any` делает `RowItem = Record<string, any>`, что отключает проверку типов для данных строк по всей кодовой базе.

### ⬜ 3.4. Нет rate limiting для remote запросов

Debounce 300ms спасает от частых нажатий, но не от программного вызова `dataProvider.apply()` в цикле. Нет защиты от flood-запросов.

---

## 4. Пользовательский опыт (UX)

### ⬜ 4.1. Нет состояния ошибки в UI

`core.error` устанавливается при ошибках запроса, но ни один компонент layout не отображает ошибку. Пользователь видит пустую таблицу без объяснения.

### ⬜ 4.2. Нет состояния пустых данных

Нет компонента-заглушки для случая когда `items.length === 0`. Пользователь видит пустое пространство.

### ⬜ 4.3. Захардкоженные русские строки (нет i18n)

| Файл | Строка | Текст |
|------|--------|-------|
| `SearchField.vue:55` | placeholder | `"Введите для поиска"` |
| `SearchField.vue:66` | label | `"Поиск"` |
| `PageDetails.vue:41-45` | declension | `"записи"`, `"записей"` |
| `PageDetails.vue:52` | prefix | `"Записи с ... до ... из ..."` |

Компонент непригоден для англоязычных/международных проектов без fork-а.

### ⬜ 4.4. Нет Accessibility (a11y)

- Checkbox-элементы (`CheckboxElement.vue`) — div с `@click`, без `role="checkbox"`, без `aria-checked`, без keyboard-обработки;
- Кнопки пагинации — div с `@click`, без `role="button"`, без `aria-label`;
- Поле поиска — нет `aria-label`, нет `role="search"` на обёртке;
- Сортируемые заголовки — нет `aria-sort`, нет `role="columnheader"`;
- Вся таблица — div-based, нет `role="table"`, `role="row"`, `role="cell"`.

### ⬜ 4.5. Нет keyboard navigation

- Checkbox по клику только, нет Enter/Space;
- Пагинация только мышью;
- Нет Tab-навигации по интерактивным элементам.

---

## 5. Layout (слой не готов)

Слой layout находится в незавершённом состоянии. Требуется комплексная доработка.

### ⬜ 5.1. Стили не проработаны

Многие компоненты содержат пустые `<style>` блоки (`Root.vue`, `TableView.vue`, `BodyCellData.vue`, `BodyCellNumbering.vue`, `DataTable.vue`). Визуальное оформление не доведено до продакшн-качества.

### ⬜ 5.2. Не проверено отображение с различными комбинациями параметров

Таблица не протестирована визуально для сценариев:
- scrollX + sticky columns
- stickyHeader + scrollY
- striped rows (prop существует, стили не реализованы)
- verticalBorders + sticky columns
- numbering + selection + sticky + scrollX (все вместе)
- пустая таблица (нет NoDataPlug)
- состояние ошибки (нет ErrorPlug)
- loading skeleton при разных ширинах колонок

### ⬜ 5.3. Конфликт `display: flex` / `display: grid` в TableRow

`TableRow.vue:40-41` — CSS задаёт `display: flex`, но через `:style="gridStyle"` передаётся `display: grid`. Inline-стиль побеждает, но CSS-свойства `flex-wrap: nowrap; align-items: stretch` не имеют эффекта при `display: grid`.

### ⬜ 5.4. CSS-селектор `td.dt182-sticky-end` в TableRow

`TableRow.vue:54` — используется селектор `td.dt182-sticky-end`, но таблица рендерит `div`, а не `td`. Мёртвый CSS.

### ⬜ 5.5. `!important` в стилях

`SearchField.vue:91-94,151-154` — `!important` на SVG-иконках. Хрупкое решение, усложняет кастомизацию.

### ⬜ 5.6. Shimmer-анимация всегда в DOM

`BodyCellWrapper.vue:51-58` — `.dt182-cell-loader` рендерится для **каждой** ячейки всегда, скрыт через `visibility: hidden`. Анимация `shimmer 1.5s infinite` работает даже когда невидима — расход GPU/CPU.

### ⬜ 5.7. Нет border-radius на контейнере таблицы

### ⬜ 5.8. Striped rows не реализованы

Prop `striped` принимается, но CSS-стили для чередующихся строк отсутствуют.

---

---

## 6. Сборка и зависимости

### ⬜ 6.1. CI не запускает `check:types`

`ci.yml` — запускает `test`, `lint`, `stylelint`, `build`, но не запускает `vue-tsc --noEmit`. Ошибки типов могут попасть в main.

### ⬜ 6.2. Устаревшие/избыточные зависимости

- `babel-core: ^7.0.0-bridge.0` — бридж для babel 6→7, вероятно не нужен;
- `vue-jest: ^3.0.7` — для Vue 2, но тестов нет — неясно, работает ли конфигурация;
- `@types/vue: ^2.0.0` — Vue 2.7 имеет встроенные типы, этот пакет может конфликтовать.

### ⬜ 6.3. Нет `files` в package.json

`package.json` не содержит поле `files`, значит npm publish включает **всё** (playground, docs, roadmaps, CLAUDE.md). Увеличивает размер пакета.

### ⬜ 6.4. Node 18 в CI vs текущий LTS

CI использует Node 18, который выходит из LTS в апреле 2025. Стоит обновить до Node 20.

---

## 7. Прочие замечания

### ⬜ 7.1. `selectionLimit` default = 1000

`DataTable.vue:80` — default `selectionLimit: 1000`. Неочевидное ограничение, может сбить с толку при работе с большими датасетами.

### ⬜ 7.2. Magic numbers

- `DEBOUNCE_MS = 300` (useDataProvider.ts:7) — единственная вынесенная константа;
- `maxPages = 5` (Paginator.vue:26) — hardcoded;
- `width: '50px'` (useColumnRegistry.ts:55) — numbering column width;
- `width: '42px'` (useColumnRegistry.ts:69) — selection column width.

### ⬜ 7.3. `leftStickyColumnsExist` вычисляется из старых колонок

`useColumnRegistry.ts:42` — перед `columns.value = []` читается `columns.value.filter(...)` для определения sticky. Это означает что при **первом** rebuild (columns пуст) numbering/selection не станут sticky, даже если первая data-колонка sticky. Sticky для служебных колонок подхватится только со **второго** rebuild.

### ⬜ 7.4. `totalCount` в LocalAdapter считается до фильтрации

`useLocalAdapter.ts:11` — `const totalCount = rowItems.length` считается до search-фильтрации, что корректно для отображения "из N всего", но `rangeInfo.total` в core использует `tableData.total`, а `PageDetails` показывает `filtered` — логика распределена по 3 местам, легко запутаться.

### ⬜ 7.5. `selectAllRows` не учитывает ранее выбранные строки с других страниц

`useCore.ts:212-226` — `selectAllRows` полностью заменяет `selectedRowKeys` ключами текущей страницы, теряя выбор с других страниц. В связке с `clearSelection` при смене страницы (строка 127) это последовательно, но ограничивает сценарий "выбрать со всех страниц".
