# CLAUDE.md — vue-datatables-182

## Обзор

Vue-компонент datatable для Vue 2.7+ (Composition API). Поддерживает локальные и удалённые источники данных, поиск, пагинацию, сортировку, выбор строк, sticky-колонки. Рендеринг через CSS Grid.

## Команды

```bash
npm run build          # Сборка (Rollup → dist/)
npm test               # Тесты (Jest)
npm run test:watch     # Тесты в watch-режиме
npm run lint           # ESLint
npm run lint:fix        # ESLint с авто-исправлением
npm run stylelint      # Stylelint (SCSS)
npm run stylelint:fix   # Stylelint с авто-исправлением
npm run check:types    # Проверка типов (vue-tsc)
npm run check:code     # Полная проверка: типы + тесты + линтеры
npm run playground     # Dev-сервер playground (Vite)
```

## Архитектура

Однонаправленный поток данных с разделением ответственности на 5 слоёв:

```
Props → Core (state) → DataProvider (данные) → Controller (оркестрация) → Layout (UI)
                                                       ↑
                                            Действия пользователя
```

### Слои

| Слой | Путь | Назначение |
|------|------|------------|
| **Core** | `src/components/core/` | Единый источник истины. Хранит состояние: данные, пагинация, поиск, сортировка, выбор строк, загрузка. Изменения через явные методы (setPage, setSort, toggleSelection и т.д.). Синхронизация с props через normalize. |
| **DataProvider** | `src/components/data/` | Получение и подготовка данных. Абстрагирует источник (локальный массив / удалённый API). Содержит `useLocalAdapter` (клиентская фильтрация/сортировка/пагинация) и `useRemoteAdapter` (HTTP-запросы через adapter-паттерн). |
| **ColumnRegistry** | `src/components/columns/` | Сбор колонок из декларативного описания и слотов. Валидация, нормализация, уникальность ключей. Три вида: DATA, NUMBERING, SELECTION. |
| **Controller** | `src/components/controller/` | Связь UI и системы. handlers — обработчики действий пользователя; ui — computed-значения для отображения. UI не содержит бизнес-логики. |
| **Layout** | `src/components/layout/` | Чистое отображение. Получает данные и обработчики из controller. Не мутирует состояние. |

### Ключевые архитектурные решения

- **CSS Grid** вместо `<table>` — полный контроль над шириной колонок и sticky-поведением
- **Sticky-колонки** — обязательно указывать width; offset вычисляется через calc()
- **Выбор строк** — массив ключей (предсказуемость + API), временный Set для вычислений. Reconcile при смене данных. Сброс при смене страницы/сортировки/поиска
- **Adapter-паттерн** — requestAdapter/responseAdapter изолируют формат взаимодействия с backend
- **Нет глобального state management** — только Vue reactivity (ref, computed). Pinia только в playground

## Структура проекта

```
src/
├── index.ts                          # Главный экспорт: DataTable, DataTableColumn, VueDatatables182
├── components/
│   ├── DataTable.vue                 # Корневой setup-компонент
│   ├── DataTableColumn.vue           # Мета-компонент (не рендерится)
│   ├── core/                         # Состояние (useCore)
│   ├── data/                         # Провайдер данных (useDataProvider, useLocalAdapter, useRemoteAdapter)
│   ├── columns/                      # Реестр колонок (useColumnRegistry)
│   ├── controller/                   # Оркестрация UI (useController)
│   ├── layout/
│   │   ├── Root.vue                  # Корневой layout
│   │   ├── containers/               # Toolbar, Pagination, Wrapper
│   │   ├── controls/                 # SearchField, Paginator, RowsPerPageSelector
│   │   ├── table/
│   │   │   ├── TableView.vue
│   │   │   ├── header/               # HeaderCell{Data,Numbering,Selection}, TableHeader
│   │   │   ├── body/                 # BodyCell{Data,Numbering,Selection,Slot,Wrapper}, TableBody, TableRow
│   │   │   ├── controls/             # CheckboxElement
│   │   │   └── build-grid-layout.ts  # Расчёт CSS Grid
│   │   └── widgets/                  # PageDetails
│   ├── plugin/                       # Vue-плагин с конфигурацией
│   └── utils/                        # debounce, decode-string
├── logger/                           # Логирование
└── types/                            # Публичные типы (.d.ts)

playground/                           # Dev-среда (Vite + Pinia)
docs/                                 # Документация
```

## Конвенции именования

- **Composables**: `use{Name}.ts` в camelCase (useCore, useController, useDataProvider, useColumnRegistry)
- **Vue-компоненты**: PascalCase (TableView.vue, BodyCellData.vue, HeaderCellSelection.vue)
- **Типы**: отдельный `types.ts` в каждом модуле; публичные типы в `src/types/`
- **Индексы**: `index.ts` для реэкспорта из каждого модуля
- **Утилиты**: kebab-case файлы (normalize-slot-result.ts, build-grid-layout.ts, decode-string.ts)
- **Стили**: SCSS; переменные в `vars.scss`, миксины в `mixins.scss`

## Сборка и CI/CD

- **Сборка**: Rollup → UMD + ES модули + CSS + типы (.d.ts)
- **CI**: GitHub Actions (.github/workflows/ci.yml) — на каждый PR: npm ci → test → lint → stylelint → build
- **Публикация**: автоматически при создании тега `v*` → npm publish с определением dist-tag (alpha/beta/rc/latest)
- **Peer dependency**: `vue ^2.7.16`

## Ветвление

- Основная ветка: `dev` (в будущем → `main`)
- Именование: `feat-*`, `fix-*`, `wip-*`

## Стек

- Vue 2.7 (Composition API)
- TypeScript
- Rollup (сборка библиотеки)
- Vite (playground)
- Jest + @vue/test-utils (тесты)
- ESLint + Prettier + Stylelint (линтинг)
- SCSS + PostCSS (стили)
