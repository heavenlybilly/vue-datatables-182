Описываю полный flow “от создания компонента до работы”, без кода, но максимально конкретно. Это эталон, от которого ты можешь не отклоняться и не ловить хаос.

-------

## Роли слоёв (коротко, чтобы дальше было понятно)
•	DataTable.vue — orchestrator, ничего не решает
•	Column registry — знает какие колонки есть
•	Core — знает какое сейчас состояние таблицы и какие строки отображать
•	Adapter (local/remote) — знает откуда брать данные
•	Interactions — знает что делать при действиях пользователя
•	Layout/View — знает как это нарисовать

-------

## Создание компонента (setup())

### DataTable.vue (точка входа)

DataTable.vue:
•	читает props
•	определяет режим (local | remote)
•	создаёт слои в правильном порядке
•	связывает их между собой

❗ Он не делает вычислений, только соединяет.

-------

## Инициализация слоёв (строго по порядку)

### Column registry

Создаётся первым.

Вход:
•	<DataTableColumn> (slots / children)
•	служебные флаги (numbering, rowSelection, actions)
•	rowKey

Выход (API):
•	columns[] — нормализованный список колонок
•	columnMeta — orderable/searchable/sticky/width
•	validate() — проверки (rowKey обязателен, width для sticky и т.д.)

⛔ Column registry:
•	не знает про данные
•	не знает про pagination/search
•	не знает про DOM

-------

### Core state

Создаётся вторым.

Вход:
•	начальные props (pagination, searching, sorting и т.п.)
•	columnsMeta (чтобы знать, что можно сортировать/искать)

Хранит:
•	page, perPage
•	searchQuery
•	sortState
•	selectedKeys
•	items, total
•	displayRows
•	isLoading, error

API Core:
•	normalize() — привести state в консистентный вид
•	setItems(items, total)
•	recompute() — local pipeline
•	resetPage()
•	setLoading(true/false)

⛔ Core:
•	не делает fetch
•	не знает, local или remote
•	не знает про DOM

-------

### Adapter (local или remote)

Создаётся третьим.

Local adapter

Вход:
•	props.items
•	core.state

API:
•	compute() → { items, total }

Remote adapter

Вход:
•	url
•	core.state
•	requestAdapter
•	responseAdapter

API:
•	fetch() → { items, total }

⛔ Adapter:
•	не знает про layout
•	не знает про клики
•	работает только с core

-------

### Interaction layer

Создаётся четвёртым.

Вход:
•	core API
•	adapter API
•	emit()

Отвечает за:
•	сортировку
•	поиск
•	pagination
•	selection
•	reload / reset

Пример взаимодействия:
•	пользователь кликнул сортировку →
•	interaction меняет core.sortState
•	сбрасывает page
•	запускает adapter (local/remote)

⛔ Interaction:
•	не рендерит
•	не хранит данные
•	не знает про колонки напрямую

-------

### View / Layout

Создаётся последним.

Вход:
•	columns[]
•	core.displayRows
•	core.isLoading
•	handlers из interaction

Отвечает за:
•	div-table layout
•	sticky header / columns
•	scroll
•	визуальные состояния

⛔ View:
•	не мутирует state напрямую
•	вызывает только handlers

-------

## Bootstrapping (первый запуск)

### Нормализация

После создания всех слоёв:

columnRegistry.validate()
core.normalize()

Никаких запросов пока.

-------

### Первичная загрузка данных

Ровно один раз.

if local:
adapter.compute()
core.setItems()
else:
core.setLoading(true)
adapter.fetch()
core.setItems()
core.setLoading(false)

❗ Только adapter инициирует данные.

-------

### Первый render
•	View получает готовые columns + displayRows
•	рисует таблицу

-------

## onMounted (DOM-фаза)

Только layout-задачи:
•	измерение ширин колонок (если нужно)
•	вычисление sticky offsets
•	resize observers

⛔ Никаких fetch / recompute данных.

-------

## Flow при действиях пользователя

Пример: сортировка

View → interaction.onSort()
interaction → core.sortState = new
interaction → core.resetPage()
interaction → adapter.compute() | adapter.fetch()
adapter → core.setItems()
core → обновляет displayRows
View → rerender

Пример: поиск

View → interaction.onSearch()
interaction → core.searchQuery
interaction → debounce
interaction → adapter.compute() | fetch()

Пример: selection

View → interaction.toggleRow(key)
interaction → core.selectedKeys
interaction → emit(selectionChange)
View → rerender


-------

## Flow при изменении props

Тип prop	Реакция
layout	только View
pipeline	core.normalize → adapter
items	local adapter
url	remote fetch
selection config	normalize selectedKeys


-------

## Главное правило (если его не нарушать — всё будет стабильно)

Только один слой может делать одну вещь:

	•	fetch — adapter
	•	состояние — core
	•	события — interaction
	•	отображение — view
	•	структура колонок — registry

Если ты это выдержишь — компонент не “расползётся”, даже когда появятся:
•	virtual scroll
•	tree rows
•	column resize
•	row expand

Если хочешь, следующим шагом могу пройтись по твоим текущим пропсам и показать, к какому слою каждый относится и какие сейчас смешаны неправильно.