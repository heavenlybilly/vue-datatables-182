# Отчёт о проекте `vue-datatables-182`

## Состояние реализации

Пакет реализует контракт `API 2.0` для `Vue ^3.5.0`. В `package.json` пока
указана версия `1.3.0-alpha.0`; выпуск `2.0` ещё не опубликован.
Пакет содержит модуль `ESM`, отдельный файл `CSS` и декларации `TypeScript`.
Единственная внешняя зависимость во время выполнения — `Vue`.

Реализованы локальные и удалённые данные, поиск, одна сортировка, пагинация,
выбор записей текущей страницы, реактивные колонки, закрепление, слоты состояний,
локализация и серверный рендеринг. Фабрика `createTypedTable<Item>()` связывает
тип записи с контрактами компонентов без дополнительных обёрток.
Виртуализация, выбор между страницами, несколько одновременных сортировок
и встроенный экспорт данных не входят в текущую реализацию.

Автоматические проверки охватывают состояние, обработку данных, запросы,
доступность, типизацию, сборку и установленный архив пакета. Примеры документации
извлекаются в отдельное приложение и проверяются вместе с минимальными
и текущими поддерживаемыми версиями `Vue` и `TypeScript`, сборщиками `Vite`
и `Webpack`, серверным рендерингом и восстановлением интерфейса на клиенте.
Сценарии `Storybook` проверяются в `Chromium`.

В `CI` используется матрица `Node 22` и `Node 24`. Перед публикацией сверяются
тег `Git`, версия пакета, метаданные и контрольная сумма `SHA-512`.
Канал публикации — `alpha`, `beta`, `rc` или `latest` — определяется версией.
После успеха всей матрицы публикуется проверенный архив из задания `Node 24`,
без повторной сборки.

Условия выпуска включают ручную проверку подсказок `WebStorm`, проверку
`Firefox 84.0` и остальных целевых браузеров, успешный запуск `CI` и отдельное
назначение версии выпуска. Текущий статус приведён в [плане релиза](major-release-plan.md).

## Как связаны части проекта

`DataTable` получает параметры и объявления `DataTableColumn` из основного слота.
Наблюдатель колонок обновляет реестр. Слой состояния хранит и нормализует
параметры запроса, выбранные ключи и данные. Поставщик данных выполняет локальную
обработку или `HTTP`-запрос. Контроллер связывает действия пользователя с состоянием
и вычисляет данные для отображения. Слой интерфейса выводит панель инструментов,
заголовок и строки с общей сеткой, состояния загрузки и пагинацию.

Плагин передаёт конфигурацию отдельно для каждого приложения. Локализация
объединяет стандартные сообщения, настройки приложения и настройки таблицы.
Публичная точка входа — `src/index.ts`; внутренние файлы не предназначены
для прямого импорта потребителями пакета.

## Назначение файлов

Ниже перечислены все 215 файлов исходного проекта, включая этот отчёт и
сгенерированный служебный обработчик `MSW`, который хранится в репозитории. Пути указаны от корня.
Зависимости, служебные данные `Git` и `IDE` и временные результаты сборок перечислены отдельно
по категориям: они не являются самостоятельными исходными модулями проекта.

### Корневые файлы

| Файл                                          | Назначение                                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [AGENTS.md](../AGENTS.md)                     | Инструкции для работы с репозиторием: контракт, стиль кода, проверки и ограничения выпуска.            |
| [package.json](../package.json)               | Метаданные `npm`-пакета, команды, зависимости, экспорты и состав публикуемого архива.                  |
| [package-lock.json](../package-lock.json)     | Зафиксированное дерево `npm`-зависимостей для воспроизводимого `npm ci`.                               |
| [readme.md](../readme.md)                     | Основная пользовательская инструкция: установка, локальные и удалённые данные, конфигурация и команды. |
| [CHANGELOG.md](../CHANGELOG.md)               | Изменения и несовместимости будущего релиза 2.0.                                                       |
| [LICENSE](../LICENSE)                         | Лицензия `MIT` на использование и распространение пакета.                                              |
| [tsconfig.json](../tsconfig.json)             | Строгая проверка `TypeScript` для исходников, тестов, сценариев и конфигурации.                        |
| [tsconfig.build.json](../tsconfig.build.json) | Генерация деклараций из `src` в `build/types`.                                                         |
| [vitest.config.ts](../vitest.config.ts)       | Модульные и интеграционные тесты в `jsdom` и отчёты покрытия `V8`.                                     |
| [rollup.config.js](../rollup.config.js)       | Объединение промежуточных деклараций в один `index.d.ts` с внешним `Vue`.                              |
| [.eslintrc.cjs](../.eslintrc.cjs)             | Правила `ESLint`, `TypeScript`, `Vue`, импортов и читаемости `src`.                                    |
| [.eslintignore](../.eslintignore)             | Исключения `ESLint` для зависимостей и сгенерированных файлов.                                         |
| [.prettierrc.json](../.prettierrc.json)       | Форматирование и порядок импортов.                                                                     |
| [.stylelintrc.json](../.stylelintrc.json)     | Правила `Stylelint` для `SCSS` и стилей `Vue`.                                                         |
| [.stylelintignore](../.stylelintignore)       | Исключения `Stylelint`.                                                                                |
| [.gitignore](../.gitignore)                   | Исключения `Git`: зависимости, сборки, `IDE`, кэш, переменные окружения и артефакты выпуска.           |
| [.nvmrc](../.nvmrc)                           | Основная локальная версия `Node`: 22.                                                                  |

### Конфигурация и `CI`

| Файл                                                                                | Назначение                                                                                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml)                             | Матрица `Node` 22/24, проверки кода/архива/`Storybook`, передача проверенного архива пакета и публикация по тегу. |
| [config/vite.shared.ts](../config/vite.shared.ts)                                   | Общие `Vue`/`SVG`-плагины, псевдоним пути `@`, целевая среда `Firefox 84` для JavaScript и CSS.                   |
| [config/library.ts](../config/library.ts)                                           | Библиотечная `ESM`/`CSS`-сборка; проверяет, что единственная внешняя зависимость во время выполнения — `Vue`.     |
| [config/benchmark.ts](../config/benchmark.ts)                                       | Отдельная конфигурация локальных измерений производительности без отчёта покрытия.                                |
| [config/storybook-tests.ts](../config/storybook-tests.ts)                           | Интеграция `Storybook` с `Vitest` и запуск интерактивных сценариев в `Chromium` без окна браузера.                |
| [.storybook/main.ts](../.storybook/main.ts)                                         | Поиск сценариев, подключение дополнений, настройка `Vue`/`Vite` и статических ресурсов каталога.                  |
| [.storybook/preview.ts](../.storybook/preview.ts)                                   | Общие параметры отображения, стили и загрузчик `MSW`.                                                             |
| [.storybook/public/mockServiceWorker.js](../.storybook/public/mockServiceWorker.js) | Сгенерированный служебный обработчик `MSW`, перехватывающий запросы браузерных сценариев.                         |

### Публичный `API`

| Файл                                                                        | Назначение                                                                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](../src/index.ts)                                             | Публичная точка входа: компоненты, плагин, фабрика, адаптеры, сообщения и типы.                                               |
| [src/create-typed-table.ts](../src/create-typed-table.ts)                   | Фабрика `createTypedTable<Item>()` и специализированные типы исходных компонентов.                                            |
| [src/svg.d.ts](../src/svg.d.ts)                                             | Декларация импорта `SVG` как строки для `TypeScript`.                                                                         |
| [src/types/index.ts](../src/types/index.ts)                                 | Сводный экспорт публичных контрактов типов.                                                                                   |
| [src/types/column.ts](../src/types/column.ts)                               | Параметры колонки, контекст слота ячейки и типизированные слоты.                                                              |
| [src/types/constants.ts](../src/types/constants.ts)                         | Значения и типы `Source`, `SortDirection`, `TextAlign` и `Sticky`.                                                            |
| [src/types/events.ts](../src/types/events.ts)                               | Сигнатуры событий и данные событий запросов, выбора и клика строки.                                                           |
| [src/types/messages.ts](../src/types/messages.ts)                           | Контракт локализации и контекст формирования текста диапазона.                                                                |
| [src/types/plugin.ts](../src/types/plugin.ts)                               | Публичные параметры регистрации плагина и конфигурации приложения.                                                            |
| [src/types/remote.ts](../src/types/remote.ts)                               | Контракты фильтра `JSON`, адаптеров запроса и ответа и параметров `HTTP`-запроса.                                             |
| [src/types/rows.ts](../src/types/rows.ts)                                   | Типы записи, ключа, функции получения ключа и результата со счётчиками записей.                                               |
| [src/types/table.ts](../src/types/table.ts)                                 | Параметры таблицы, сортировка и слоты панели инструментов и состояний.                                                        |
| [src/components/DataTable.vue](../src/components/DataTable.vue)             | Объединение реестра колонок, состояния, поставщика данных и контроллера; передача слотов и методов `reload`/`clearSelection`. |
| [src/components/DataTableColumn.vue](../src/components/DataTableColumn.vue) | Декларативный компонент метаданных колонки и слот `cell`; сам ничего не рисует.                                               |
| [src/components/types.ts](../src/components/types.ts)                       | Внутренние типы слотов, ключи с маркером типа и реэкспорт публичных контрактов.                                               |

### Состояние

| Файл                                                                                        | Назначение                                                                                           |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [src/components/core/index.ts](../src/components/core/index.ts)                             | Точка импорта `useCore` и типов слоя состояния.                                                      |
| [src/components/core/types.ts](../src/components/core/types.ts)                             | Контракты слоя состояния, его зависимостей, состояния и доступных операций.                          |
| [src/components/core/useCore.ts](../src/components/core/useCore.ts)                         | Объединение параметров запроса и выбора, хранение данных, загрузки и ошибки, нормализация переходов. |
| [src/components/core/useOwnedField.ts](../src/components/core/useOwnedField.ts)             | Модель одного управляемого или автономного поля с подтверждением родителя и коррекциями.             |
| [src/components/core/useQueryState.ts](../src/components/core/useQueryState.ts)             | Страница, размер страницы, поиск и сортировка: режим управления, ограничения и синхронизация.        |
| [src/components/core/useSelectionState.ts](../src/components/core/useSelectionState.ts)     | Выбор текущей страницы, лимиты, сверка ключей с данными и события выбора.                            |
| [src/components/core/helpers.ts](../src/components/core/helpers.ts)                         | Создание и проверка функции получения `rowKey` из поля или обработчика.                              |
| [src/components/core/row-keys.ts](../src/components/core/row-keys.ts)                       | Валидация допустимых, уникальных ключей и полных наборов строк.                                      |
| [src/components/core/state-normalization.ts](../src/components/core/state-normalization.ts) | Нормализация чисел/сортировки и сравнение ключей/сортировки.                                         |

### Данные и `HTTP`-запросы

| Файл                                                                                              | Назначение                                                                                                             |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [src/components/data/index.ts](../src/components/data/index.ts)                                   | Точка импорта поставщика данных и контрактов слоя данных.                                                              |
| [src/components/data/types.ts](../src/components/data/types.ts)                                   | Зависимости локального и удалённого адаптеров и интерфейс `DataProvider`.                                              |
| [src/components/data/useDataProvider.ts](../src/components/data/useDataProvider.ts)               | Выбор локальной обработки или удалённых запросов, отложенный запуск, обновление и освобождение ресурсов.               |
| [src/components/data/useLocalAdapter.ts](../src/components/data/useLocalAdapter.ts)               | Проверка локальных записей, поиск, сортировка, подсчёт результатов и получение текущей страницы.                       |
| [src/components/data/useRemoteAdapter.ts](../src/components/data/useRemoteAdapter.ts)             | Отправка запросов, адаптеры, снимки контекста, ошибки и запрос корректировки страницы.                                 |
| [src/components/data/useDataSynchronization.ts](../src/components/data/useDataSynchronization.ts) | Синхронизация данных и контекста; объединение изменений, немедленный или отложенный запуск обработки.                  |
| [src/components/data/build-request-context.ts](../src/components/data/build-request-context.ts)   | Построение запроса из состояния таблицы и серверного `sortField`.                                                      |
| [src/components/data/default-adapters.ts](../src/components/data/default-adapters.ts)             | Стандартные адаптеры: запрос `POST` с `JSON` и преобразование ответа сервера.                                          |
| [src/components/data/prepare-request.ts](../src/components/data/prepare-request.ts)               | Проверка построенного запроса, заголовков, метода и тела запроса и добавление `CSRF` для запросов к тому же источнику. |
| [src/components/data/request-lifecycle.ts](../src/components/data/request-lifecycle.ts)           | Идентификатор запроса, `AbortController`, проверка актуальности попытки и завершающие события.                         |
| [src/components/data/until-aborted.ts](../src/components/data/until-aborted.ts)                   | Ожидание операции до завершения или `AbortSignal`.                                                                     |
| [src/components/data/validate-response.ts](../src/components/data/validate-response.ts)           | Проверка строк, счётчиков и ключей и вычисление допустимой страницы ответа.                                            |
| [src/components/data/json-value.ts](../src/components/data/json-value.ts)                         | Проверка обычных объектов и `JSON`-совместимых значений без циклов.                                                    |
| [src/components/data/sort-local-rows.ts](../src/components/data/sort-local-rows.ts)               | Стабильная сортировка локальных строк с проверкой типов значений.                                                      |
| [src/components/data/helpers.ts](../src/components/data/helpers.ts)                               | Нормализация текста поиска и канонический `JSON`-снимок контекста.                                                     |

### Колонки

| Файл                                                                                                    | Назначение                                                                                                         |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [src/components/columns/index.ts](../src/components/columns/index.ts)                                   | Точка импорта реестра колонок и типов колонок.                                                                     |
| [src/components/columns/types.ts](../src/components/columns/types.ts)                                   | Внутренние `ColumnDef`, `kind`, ключ с маркером типа, слот `cell` и интерфейс реестра колонок.                     |
| [src/components/columns/ColumnObserver.ts](../src/components/columns/ColumnObserver.ts)                 | Наблюдение за основным слотом, обновление реестра и уведомление о готовности колонок.                              |
| [src/components/columns/useColumnRegistry.ts](../src/components/columns/useColumnRegistry.ts)           | Реестр колонок, встроенные колонки выбора и нумерации, уникальность и номер изменения параметров обработки данных. |
| [src/components/columns/normalize-slot-result.ts](../src/components/columns/normalize-slot-result.ts)   | Разбор `VNodes`/`Fragments` и извлечение деклараций колонок без мутации `VNodes`.                                  |
| [src/components/columns/normalize-column-props.ts](../src/components/columns/normalize-column-props.ts) | Нормализация привязок `camelCase`/`kebab-case`, логических атрибутов и классов; проверка параметров.               |
| [src/components/columns/column-equality.ts](../src/components/columns/column-equality.ts)               | Сравнение колонок; отделяет изменения обработки данных от внешнего вида.                                           |
| [src/components/columns/column-value.ts](../src/components/columns/column-value.ts)                     | Получение значения через `value`/`field` и безопасное текстовое представление.                                     |
| [src/components/columns/sticky-width.ts](../src/components/columns/sticky-width.ts)                     | Проверка положительной ширины закреплённой колонки в `px`.                                                         |

### Контроллер, плагин и утилиты

| Файл                                                                                                  | Назначение                                                                                                           |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [src/components/controller/index.ts](../src/components/controller/index.ts)                           | Точка импорта контроллера и его типов.                                                                               |
| [src/components/controller/types.ts](../src/components/controller/types.ts)                           | Контракты обработчиков, оформления и вычисленных данных интерфейса.                                                  |
| [src/components/controller/useController.ts](../src/components/controller/useController.ts)           | Связь действий пользователя с состоянием и поставщиком данных; вычисление сортировки и интерфейса выбора.            |
| [src/components/plugin/index.ts](../src/components/plugin/index.ts)                                   | Плагин `Vue`: конфигурация приложения и необязательная глобальная регистрация компонентов.                           |
| [src/components/plugin/types.ts](../src/components/plugin/types.ts)                                   | Внутренний тип конфигурации плагина без флага регистрации.                                                           |
| [src/components/plugin/configuration.ts](../src/components/plugin/configuration.ts)                   | `InjectionKey` и получение независимой конфигурации приложения.                                                      |
| [src/components/localization/default-messages.ts](../src/components/localization/default-messages.ts) | Стандартные подписи, доступные имена и функции сообщений.                                                            |
| [src/components/localization/use-messages.ts](../src/components/localization/use-messages.ts)         | Объединение стандартных сообщений с настройками приложения и таблицы, передача локализации через `provide`/`inject`. |
| [src/components/utils/debounce.ts](../src/components/utils/debounce.ts)                               | Отложенный вызов с отменой таймера.                                                                                  |

### Интерфейс

| Файл                                                                                                                        | Назначение                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [src/components/layout/Root.vue](../src/components/layout/Root.vue)                                                         | Композиция панели инструментов, таблицы, выбора размера страницы, диапазона и элементов пагинации.              |
| [src/components/layout/containers/Wrapper.vue](../src/components/layout/containers/Wrapper.vue)                             | Общий контейнер `Flexbox`, размеры и настройка `box-sizing`.                                                    |
| [src/components/layout/containers/Toolbar.vue](../src/components/layout/containers/Toolbar.vue)                             | Размещение трёх слотов панели инструментов и поля поиска.                                                       |
| [src/components/layout/containers/Pagination.vue](../src/components/layout/containers/Pagination.vue)                       | Расположение нижней левой/правой областей интерфейса.                                                           |
| [src/components/layout/controls/SearchField.vue](../src/components/layout/controls/SearchField.vue)                         | Поиск, очистка, доступные имена и сохранение фокуса.                                                            |
| [src/components/layout/controls/RowsPerPageSelector.vue](../src/components/layout/controls/RowsPerPageSelector.vue)         | Стандартный элемент `select` для размера страницы и событие изменения значения.                                 |
| [src/components/layout/controls/Paginator.vue](../src/components/layout/controls/Paginator.vue)                             | Кнопки страниц, переходы, сокращение диапазона и клавиатурная доступность.                                      |
| [src/components/layout/controls/search-field.scss](../src/components/layout/controls/search-field.scss)                     | Стили поля поиска, иконок и очистки.                                                                            |
| [src/components/layout/controls/paginator.scss](../src/components/layout/controls/paginator.scss)                           | Стили кнопок страниц и их состояний.                                                                            |
| [src/components/layout/widgets/PageDetails.vue](../src/components/layout/widgets/PageDetails.vue)                           | Вычисление диапазона видимых записей и его локализованный текст.                                                |
| [src/components/layout/table/TableView.vue](../src/components/layout/table/TableView.vue)                                   | Прокручиваемая область, общая сетка `CSS` `Grid`, заголовок, содержимое и слоты состояний.                      |
| [src/components/layout/table/TableContent.vue](../src/components/layout/table/TableContent.vue)                             | Выбор между строками, загрузкой, ошибкой и пустыми состояниями; стандартное или пользовательское содержимое.    |
| [src/components/layout/table/TableRows.vue](../src/components/layout/table/TableRows.vue)                                   | Отображение строк и колонок, номера, контекст слотов, обработка действий и выбора, стили ячеек.                 |
| [src/components/layout/table/build-grid-layout.ts](../src/components/layout/table/build-grid-layout.ts)                     | Порядок левых, обычных и правых колонок, дорожки сетки `CSS` `Grid` и смещения закреплённых колонок.            |
| [src/components/layout/table/cell-style.ts](../src/components/layout/table/cell-style.ts)                                   | Ширина, выравнивание, позиция закрепления и `z-index` конкретной ячейки.                                        |
| [src/components/layout/table/use-viewport-width.ts](../src/components/layout/table/use-viewport-width.ts)                   | Измерение ширины видимой области через `ResizeObserver` с освобождением ресурсов и запасным способом измерения. |
| [src/components/layout/table/types.ts](../src/components/layout/table/types.ts)                                             | Константы/тип состояния флажка: снят, установлен или частично установлен.                                       |
| [src/components/layout/table/table-view.scss](../src/components/layout/table/table-view.scss)                               | Основные стили сетки, прокрутки, закрепления колонок и действий строк.                                          |
| [src/components/layout/table/controls/CheckboxElement.vue](../src/components/layout/table/controls/CheckboxElement.vue)     | Стандартный флажок, `indeterminate`, блокировка и доступные подписи.                                            |
| [src/components/layout/table/header/TableHeader.vue](../src/components/layout/table/header/TableHeader.vue)                 | Контейнер заголовка с `role` `rowgroup`/`row` и вертикальными границами.                                        |
| [src/components/layout/table/header/HeaderCellData.vue](../src/components/layout/table/header/HeaderCellData.vue)           | Заголовок колонки, кнопка и индикатор сортировки, атрибут `aria-sort`.                                          |
| [src/components/layout/table/header/HeaderCellNumbering.vue](../src/components/layout/table/header/HeaderCellNumbering.vue) | Заголовок встроенной колонки номеров.                                                                           |
| [src/components/layout/table/header/HeaderCellSelection.vue](../src/components/layout/table/header/HeaderCellSelection.vue) | Выбор всех строк с состояниями частичного выбора и блокировки.                                                  |
| [src/components/layout/table/header/header-cell-data.scss](../src/components/layout/table/header/header-cell-data.scss)     | Стили заголовка данных и сортировки.                                                                            |
| [src/components/layout/table/body/TableBody.vue](../src/components/layout/table/body/TableBody.vue)                         | `ARIA` `rowgroup` для тела; `display` `contents` сохраняет общие дорожки сетки `CSS` `Grid`.                    |
| [src/components/layout/table/body/TableRow.vue](../src/components/layout/table/body/TableRow.vue)                           | `ARIA` `row`, клик по строке, полосы, границы и состояния закреплённых ячеек.                                   |
| [src/components/layout/table/body/BodyCellWrapper.vue](../src/components/layout/table/body/BodyCellWrapper.vue)             | Оболочка `ARIA` `cell` с состоянием загрузки/мерцающего заполнителя и стилями.                                  |
| [src/components/layout/table/body/BodyCellData.vue](../src/components/layout/table/body/BodyCellData.vue)                   | Текстовая ячейка данных с `value`/`field`.                                                                      |
| [src/components/layout/table/body/BodyCellSlot.vue](../src/components/layout/table/body/BodyCellSlot.vue)                   | Вызов слота `cell` со всеми параметрами ячейки.                                                                 |
| [src/components/layout/table/body/BodyCellNumbering.vue](../src/components/layout/table/body/BodyCellNumbering.vue)         | Отображение номера строки.                                                                                      |
| [src/components/layout/table/body/BodyCellSelection.vue](../src/components/layout/table/body/BodyCellSelection.vue)         | Флажок выбора конкретной строки.                                                                                |
| [src/components/layout/accessibility.scss](../src/components/layout/accessibility.scss)                                     | Скрытый доступный текст и стили видимого фокуса.                                                                |
| [src/components/layout/theme.scss](../src/components/layout/theme.scss)                                                     | Базовая тема и внутренние настройки плотности; публичные `CSS`-переменные наследуются.                          |
| [src/components/layout/table/body/cell-overflow.scss](../src/components/layout/table/body/cell-overflow.scss)               | Обрезка текста с многоточием для ограниченных ячеек.                                                            |
| [src/components/layout/table/controls/checkbox.scss](../src/components/layout/table/controls/checkbox.scss)                 | Минималистичный флажок с `CSS`-переменными и резервным отображением в режиме `forced-colors`.                   |
| [src/components/layout/table/sticky-edge.ts](../src/components/layout/table/sticky-edge.ts)                                 | Классы внешних границ закреплённых групп по вычисленной раскладке сетки.                                        |

### `SVG`-ресурсы

| Файл                                                                          | Назначение                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| [src/assets/chevron-left.svg](../src/assets/chevron-left.svg)                 | Иконка предыдущей страницы.                |
| [src/assets/chevron-right.svg](../src/assets/chevron-right.svg)               | Иконка следующей страницы.                 |
| [src/assets/chevron-double-left.svg](../src/assets/chevron-double-left.svg)   | Иконка первой страницы.                    |
| [src/assets/chevron-double-right.svg](../src/assets/chevron-double-right.svg) | Иконка последней страницы.                 |
| [src/assets/cross.svg](../src/assets/cross.svg)                               | Иконка очистки поиска.                     |
| [src/assets/search.svg](../src/assets/search.svg)                             | Иконка поиска.                             |
| [src/assets/sort-asc.svg](../src/assets/sort-asc.svg)                         | Индикатор возрастающей сортировки.         |
| [src/assets/sort-desc.svg](../src/assets/sort-desc.svg)                       | Индикатор убывающей сортировки.            |
| [src/assets/sort-default.svg](../src/assets/sort-default.svg)                 | Индикатор доступной неактивной сортировки. |

### Сборка и проверка опубликованного формата

| Файл                                                                                    | Назначение                                                                                                                  |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [scripts/build.mjs](../scripts/build.mjs)                                               | Чистая сборка во временном каталоге кода, стилей и типов; валидация трёх файлов и перенос в dist.                           |
| [scripts/check-package.mjs](../scripts/check-package.mjs)                               | Упаковка через `npm pack`, проверка состава архива и изолированных приложений; сохранение архива и манифеста по `--output`. |
| [scripts/documentation-examples.mjs](../scripts/documentation-examples.mjs)             | Извлечение примеров `Vue`/`TypeScript` из документации в проверяемое приложение.                                            |
| [scripts/release-policy.mjs](../scripts/release-policy.mjs)                             | Правила соответствия тега `Git` и версии, метки канала `npm` и метаданных/контрольной суммы архива.                         |
| [scripts/check-release.mjs](../scripts/check-release.mjs)                               | Проверка выпуска и архива из командной строки; передача метки канала `npm` в GitHub Actions.                                |
| [scripts/release-policy.test.mjs](../scripts/release-policy.test.mjs)                   | Проверки средствами `Node` допустимых каналов, неверных тегов и подмены архива.                                             |
| [scripts/package-check/App.vue](../scripts/package-check/App.vue)                       | Приложение с типизированной фабрикой, выбором, слотами и методами экземпляра.                                               |
| [scripts/package-check/TypedErrors.vue](../scripts/package-check/TypedErrors.vue)       | Ожидаемые ошибки типов в шаблоне: неизвестное поле колонки, неизвестное свойство записи и неполная запись.                  |
| [scripts/package-check/typed-table.ts](../scripts/package-check/typed-table.ts)         | Проверки допустимых и ошибочных типов фабрики, событий, слотов, ключей, значений и экземпляров.                             |
| [scripts/package-check/contract.ts](../scripts/package-check/contract.ts)               | Проверка публичных адаптеров, сообщений, слотов и контрактов событий.                                                       |
| [scripts/package-check/main.ts](../scripts/package-check/main.ts)                       | Клиентская точка входа изолированного приложения-потребителя.                                                               |
| [scripts/package-check/index.html](../scripts/package-check/index.html)                 | `HTML`-точка входа проверочного приложения для сборки `Vite`.                                                               |
| [scripts/package-check/tsconfig.json](../scripts/package-check/tsconfig.json)           | Строгая проверка приложения и деклараций установленного пакета.                                                             |
| [scripts/package-check/vite.config.mjs](../scripts/package-check/vite.config.mjs)       | Сборка для публикации потребителя через `Vite`, включая примеры документации.                                               |
| [scripts/package-check/webpack.config.cjs](../scripts/package-check/webpack.config.cjs) | Сборка проверочного приложения через `Webpack` 5 и загрузчик `Vue`.                                                         |
| [scripts/package-check/ssr.mjs](../scripts/package-check/ssr.mjs)                       | Проверка экспортов `ESM`, адаптеров и серверного рендеринга установленного пакета.                                          |
| [scripts/package-check/mount.mjs](../scripts/package-check/mount.mjs)                   | Проверка восстановления локальной таблицы на клиенте и запуска удалённого запроса после монтирования в `jsdom`.             |

### `Storybook`

| Файл                                                                    | Назначение                                                                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [stories/Basics.stories.ts](../stories/Basics.stories.ts)               | Базовая таблица, поиск, сортировка, пустые состояния, слоты ячеек и состояний, оформление.                                |
| [stories/Pagination.stories.ts](../stories/Pagination.stories.ts)       | Несколько страниц, последняя/единственная страница и отключённая пагинация.                                               |
| [stories/Selection.stories.ts](../stories/Selection.stories.ts)         | Выбор, частичный выбор и выбор всех строк, лимит и выбор по клику строки.                                                 |
| [stories/Layout.stories.ts](../stories/Layout.stories.ts)               | Горизонтальная прокрутка, узкий контент, ограниченный контейнер, закрепление и интерактивные проверки в браузере.         |
| [stories/Accessibility.stories.ts](../stories/Accessibility.stories.ts) | Клавиатурное управление, английские сообщения и доступное пустое состояние.                                               |
| [stories/Remote.stories.ts](../stories/Remote.stories.ts)               | Ответы сервера через `MSW`: обычный и медленный запрос, ошибки, повторные запросы и слоты состояний.                      |
| [stories/Integration.stories.ts](../stories/Integration.stories.ts)     | Управляемое состояние, независимые таблицы, реактивные данные и колонки и типизированная фабрика; интерактивные проверки. |
| [stories/Performance.stories.ts](../stories/Performance.stories.ts)     | Сценарии производительности локальной таблицы с управляемыми параметрами объёма.                                          |
| [stories/TableExample.vue](../stories/TableExample.vue)                 | Общий компонент примеров с параметрами, колонками и пользовательскими ячейками и состояниями.                             |
| [stories/ControlledExample.vue](../stories/ControlledExample.vue)       | Демонстрация состояния, управляемого родителем через `v-model`.                                                           |
| [stories/DynamicColumns.vue](../stories/DynamicColumns.vue)             | Реактивные заголовки, закрепление и изменение набора колонок.                                                             |
| [stories/ReactiveData.vue](../stories/ReactiveData.vue)                 | Обновление локальных строк с сохранением экземпляра таблицы.                                                              |
| [stories/TypedTable.vue](../stories/TypedTable.vue)                     | Пример `createTypedTable<Item>()` с типизированными слотами, событиями и ссылкой на экземпляр.                            |
| [stories/LocalBenchmark.vue](../stories/LocalBenchmark.vue)             | Демонстрация больших локальных данных и измерение отображения.                                                            |
| [stories/rows.ts](../stories/rows.ts)                                   | Общий локальный набор строк для сценариев.                                                                                |
| [stories/remote-handlers.ts](../stories/remote-handlers.ts)             | Обработчики `MSW` для удалённого `API`: поиск, сортировка, страницы и имитация ошибок.                                    |
| [stories/messages-en.ts](../stories/messages-en.ts)                     | Английский набор подписей и доступных имён.                                                                               |
| [stories/storybook.scss](../stories/storybook.scss)                     | Оформление оболочки сценариев и ограничивающих контейнеров.                                                               |
| [stories/Customization.stories.ts](../stories/Customization.stories.ts) | Темы, плотность, узкий контейнер, увеличенный текст и внешние контролы; интерактивные проверки в браузере.                |
| [stories/CustomizationTable.vue](../stories/CustomizationTable.vue)     | Типизированный пример оформления, выбора, заголовка и слотов элементов управления.                                        |
| [stories/customization.scss](../stories/customization.scss)             | Темы и стили пользовательских контролов примера.                                                                          |

### Тесты

| Файл                                                                            | Назначение                                                                                                           |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [tests/accessibility.spec.ts](../tests/accessibility.spec.ts)                   | Структура `ARIA`, стандартные элементы управления, подписи, фокус, сортировка и частичный выбор.                     |
| [tests/cell-values.spec.ts](../tests/cell-values.spec.ts)                       | Приоритет `value`, реактивное отображение и независимость слота `cell` от поиска.                                    |
| [tests/checkbox.spec.ts](../tests/checkbox.spec.ts)                             | Блокировка выбора во время загрузки и восстановление взаимодействия.                                                 |
| [tests/column-reactivity.spec.ts](../tests/column-reactivity.spec.ts)           | Изменения полей, значений, поиска, сортировки, оформления и слотов без повторного монтирования и лишних запросов.    |
| [tests/column-registry.spec.ts](../tests/column-registry.spec.ts)               | `Fragments`, нормализация `VNodes`, транзакционность реестра колонок, закрепление и версии изменений.                |
| [tests/columns.spec.ts](../tests/columns.spec.ts)                               | Логические атрибуты, неизменность параметров `VNode` и запрет повторных ключей.                                      |
| [tests/core-state.spec.ts](../tests/core-state.spec.ts)                         | Управляемое и автономное состояние, подтверждения родителя, начальные значения и корректировки.                      |
| [tests/data-lifecycle.spec.ts](../tests/data-lifecycle.spec.ts)                 | Отмена, опоздавшие ответы, смена источника, отложенный запуск, освобождение ресурсов и методы после размонтирования. |
| [tests/debounce.spec.ts](../tests/debounce.spec.ts)                             | Последние аргументы отложенного вызова, отмена и повторный запуск.                                                   |
| [tests/grid-layout.spec.ts](../tests/grid-layout.spec.ts)                       | Порядок групп закреплённых колонок, смещения и обязательная ширина.                                                  |
| [tests/layout-cells.spec.ts](../tests/layout-cells.spec.ts)                     | Согласованные стили заголовка и строк и все параметры слота ячейки между страницами.                                 |
| [tests/local-pagination.spec.ts](../tests/local-pagination.spec.ts)             | Синхронное изменение страницы, записей и выбора, сокращение данных и отключённая пагинация.                          |
| [tests/local-values.spec.ts](../tests/local-values.spec.ts)                     | Значения локального поиска и сортировки, нормализация текста и проверка типов.                                       |
| [tests/localization.spec.ts](../tests/localization.spec.ts)                     | Изоляция сообщений между приложениями, реактивные переопределения и пустой диапазон.                                 |
| [tests/plugin.spec.ts](../tests/plugin.spec.ts)                                 | Изоляция конфигурации, глобальная регистрация и `SSR` без удалённого запроса.                                        |
| [tests/remote-attempts.spec.ts](../tests/remote-attempts.spec.ts)               | Замена попыток, отмена внутри адаптера, опоздавший разбор `JSON` и потеря актуальности снимков состояния.            |
| [tests/remote-context.spec.ts](../tests/remote-context.spec.ts)                 | Поле `sortField`, контекст запроса, циклические значения `JSON`, снимки состояния и отсутствие `URL`.                |
| [tests/remote-error.spec.ts](../tests/remote-error.spec.ts)                     | Данные ошибки, завершение загрузки и повторный запрос ранее успешного контекста.                                     |
| [tests/remote-event-reentry.spec.ts](../tests/remote-event-reentry.spec.ts)     | Повторный вход в обработку запроса из обработчиков событий и актуальность попыток.                                   |
| [tests/remote-response.spec.ts](../tests/remote-response.spec.ts)               | Полнота ответа без пагинации и ограничение корректирующих запросов.                                                  |
| [tests/remote-synchronization.spec.ts](../tests/remote-synchronization.spec.ts) | Корректировка управляемой страницы, немедленный `reload` и отключение поиска или пагинации.                          |
| [tests/remote-transport.spec.ts](../tests/remote-transport.spec.ts)             | Запросы `POST`/`GET`, заголовки, учётные данные, неизменность входа и `CSRF` для того же источника.                  |
| [tests/request-scheduling.spec.ts](../tests/request-scheduling.spec.ts)         | Объединение обновлений, немедленный или отложенный запрос, независимость выбора и оформления.                        |
| [tests/row-keys.spec.ts](../tests/row-keys.spec.ts)                             | Допустимые/уникальные `rowKey`, массивы с пропущенными элементами и ошибки в ответах сервера.                        |
| [tests/selection-state.spec.ts](../tests/selection-state.spec.ts)               | Лимиты, недопустимые и удалённые ключи, изменения `rowKey` и взаимодействие с текущей страницей.                     |
| [tests/selection-ui.spec.ts](../tests/selection-ui.spec.ts)                     | Выбор всех строк, частичный выбор и нулевой лимит, всплытие события флажка и `stopPropagation` внутри `cell`.        |
| [tests/ssr-hydration.spec.ts](../tests/ssr-hydration.spec.ts)                   | Серверный рендеринг и согласованное восстановление таблицы на клиенте.                                               |
| [tests/ssr-selection.spec.ts](../tests/ssr-selection.spec.ts)                   | Восстановление частично выбранного флажка и удалённый запрос только после монтирования.                              |
| [tests/table-content.spec.ts](../tests/table-content.spec.ts)                   | Строки, загрузка, заполнитель, ошибки, повторный запрос, пустые состояния и передача слотов.                         |
| [tests/table-loading-slot.spec.ts](../tests/table-loading-slot.spec.ts)         | Реактивная замена мерцающего заполнителя пользовательским слотом `loading`.                                          |
| [tests/table-state.spec.ts](../tests/table-state.spec.ts)                       | Неизменность `items`, глубокие обновления, колонки и отсутствие лишней обработки.                                    |
| [tests/typed-table.spec.ts](../tests/typed-table.spec.ts)                       | Фабрика возвращает исходные компоненты для разных типов записи.                                                      |
| [tests/helpers/create-core.ts](../tests/helpers/create-core.ts)                 | Создание тестового состояния с реактивными параметрами и перехватом событий.                                         |
| [tests/helpers/global-table.ts](../tests/helpers/global-table.ts)               | Компонент-потребитель глобально зарегистрированных `DataTable`/`DataTableColumn`.                                    |
| [tests/helpers/local-table.ts](../tests/helpers/local-table.ts)                 | Создание/монтирование локальной таблицы для тестов.                                                                  |
| [tests/helpers/remote-table.ts](../tests/helpers/remote-table.ts)               | Создание удалённой таблицы с подменой запросов и ответов и управляемым завершением операций.                         |
| [tests/performance/local.benchmark.ts](../tests/performance/local.benchmark.ts) | Измерения локальной обработки и монтирования для разных объёмов данных; отдельная конфигурация.                      |
| [tests/table-customization.spec.ts](../tests/table-customization.spec.ts)       | Регрессии кнопки сортировки, заголовка, слотов управления, плотности, выбора и заполнителя загрузки.                 |

### Документация

| Файл                                                        | Назначение                                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [docs/project-report.md](../docs/project-report.md)         | Состояние реализации и назначение каждого исходного файла.                             |
| [docs/customization.md](../docs/customization.md)           | Публичные `CSS`-переменные, темы, плотность и расширение контролов.                    |
| [docs/api-v2.md](../docs/api-v2.md)                         | Общий контракт `API`, совместимость, публичные экспорты и границы объёма.              |
| [docs/api-v2/state.md](../docs/api-v2/state.md)             | Правила управляемого и автономного состояния, нормализации и переходов.                |
| [docs/api-v2/remote.md](../docs/api-v2/remote.md)           | Контракт `HTTP`: запросы, ответы, адаптеры, счётчики, ошибки и события.                |
| [docs/data-table.md](../docs/data-table.md)                 | Справочник `DataTable`: параметры, состояние, события, слоты, методы и ограничения.    |
| [docs/data-table-column.md](../docs/data-table-column.md)   | Справочник колонки: значения, идентификатор, контекст ячейки и ширина при закреплении. |
| [docs/migration-guide.md](../docs/migration-guide.md)       | Переход с 1.x на 2.0 и замены старых `API`.                                            |
| [docs/major-release-plan.md](../docs/major-release-plan.md) | Статус выполненных этапов и оставшиеся условия выпуска.                                |
| [docs/storybook.md](../docs/storybook.md)                   | Запуск браузерных проверок и ручной перечень проверок `Firefox`.                       |
| [docs/typed-table.md](../docs/typed-table.md)               | Использование `createTypedTable<Item>()`, типизированные контракты и ограничения.      |
| [docs/ui-highlight.svg](../docs/ui-highlight.svg)           | Векторная схема интерфейса и слотов с английскими подписями.                           |

## Сгенерированные и локальные файлы

Эти пути игнорируются `Git`. Их наличие и состав зависят от выполненных команд.

| Путь                    | Назначение                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `dist/index.js`         | Итоговый модуль `ESM` для установки пакета.                                         |
| `dist/index.css`        | Итоговые стили; подключаются отдельно.                                              |
| `dist/index.d.ts`       | Объединённые типы компонентов, фабрики и публичного `API` для `IDE` и `TypeScript`. |
| `build/types/**`        | Промежуточные декларации для объединения через `Rollup`.                            |
| `build/package/**`      | Временная сборка кода, стилей и типов перед переносом в dist.                       |
| `release/package.tgz`   | Архив, сохранённый после успешного `check:package -- --output release`.             |
| `release/manifest.json` | Название, версия и контрольная сумма `SHA-512` проверенного архива.                 |
| `storybook-static/**`   | Статический каталог `Storybook` и его ресурсы.                                      |
| `coverage/**`           | Отчёты покрытия тестами, включая формат `lcov` для `CI`.                            |
| `node_modules/**`       | Установленные зависимости; состав фиксируется в `package-lock.json`.                |
| `.git/**`               | История, индекс и служебные данные `Git`.                                           |
| `.idea/`, `.vscode/`    | Локальные настройки `IDE`.                                                          |
| `.env`                  | Локальные переменные окружения.                                                     |

Команда `check:package` создаёт приложение-потребитель во временном системном
каталоге и удаляет его после завершения. Параметр `--keep` сохраняет приложение
для диагностики. Сгенерированные декларации не редактируются вручную.

## Ограничения и условия проверки

- Типы фабрики проверяются на установленном архиве. Подсказки `WebStorm` требуют
  отдельной ручной проверки. Типизация не проверяет серверный `JSON` и не запрещает
  смешивать компоненты разных фабрик в одном шаблоне.
- Настройка сборки для `Firefox 84` преобразует синтаксис и часть `CSS`, но не
  добавляет полифиллы `API` среды выполнения. Проверки в `Chromium` не подтверждают
  совместимость с `Firefox 84.0`.
- Проверочные приложения и правила выпуска относятся к инфраструктуре проекта.
  Публикуемый архив содержит только три файла `dist`, `package.json`, `readme.md`
  и `LICENSE`.

Каталог описывает исходные файлы. После изменения состава репозитория перечень
сверяется с фактическими файлами и обновляется.
