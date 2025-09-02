# DataTable
## Props

### Данные

### `source`
Источник данных. Допустимые значения: `local` и `remote`.

```js
source: {
  type: String,
  default: 'remote'
}
```

### `url`
URL для загрузки данных. Использовать только с `source="remote"`.

```js
url: {
  type: String,
  default: null
}
```

### `items`
Массив данных для отображения. Использовать только с `source="local"`.

```js
items: {
  type: Array,
  default: () => []
}
```

### Пагинация

### `pagination`
Включает пагинацию таблицы.

```js
pagination: {
  type: Boolean,
  default: true
}
```

### `rowsPerPageOptions`
Элементы списка для выбора количества отображаемых на странице строк.

```js
rowsPerPageOptions: {
  type: Array,
  default: () => [5, 10, 25, 50, 100]
}
```

### `rowsPerPageCount`
Количество строк на странице. Значение должно присутствовать в массиве `rowsPerPageOptions`.

```js
rowsPerPageCount: {
  type: Number,
  default: 10
}
```

### `showRangeInfo`
Показывать количество записей на странице.

```js
showRangeInfo: {
  type: Boolean,
  default: true
}
```

### Поиск

### `searching`
Включает поиск.

```js
searching: {
  type: Boolean,
  default: true
}
```

### Сортировка

### `orderBy`
Наименование столбца, по которому данные будут отсортированы по умолчанию.

```js
orderBy: {
  type: String,
  default: null
}
```

### `orderDirection`
Порядок сортировки по умолчанию. Допустимые значения: `asc` и `desc`.

```js
orderDirection: {
  type: String,
  default: 'asc'
}
```

### Общие параметры

### `actions`
Добавляет столбец с действиями.

*___Примечание:___ содержимое ячеек столбца необходимо добавить с помощью слота `actions`.*

```js
actions: {
  type: Boolean,
  default: false
}
```

### `numbering`
Добавляет столбец с нумерацией строк.

```js
numbering: {
  type: Boolean,
  default: false
}
```

### `rowSelection`
Добавляет столбец с чек-боксами для выделения строк.

```js
rowSelection: {
  type: Boolean,
  default: false
}
```

### `rowsClickable`
Позволяет использовать событие `@click` для строки таблицы.

```js
rowsClickable: {
  type: Boolean,
  default: false
}
```

### `selectOnRowClick`
Позволяет выделять строки нажатием ЛКМ на них.

*___Примечание:___ необходимо указать `rowSelection` и `rowsClickable` со значением `true`.*

```js
selectOnRowClick: {
  type: Boolean,
  default: false
}
```

### Внешний вид

### `scrollX`
Включает горизонтальную прокрутку таблицы.

```js
scrollX: {
  type: Boolean,
  default: false
}
```

### `fixedColumnsStart`
Количество закрепленных столбцов с левого края.

*___Примечание:___ использовать, только если разрешена горизонтальная прокрутка.
Необходимо указать фиксированную ширину для закрепленных столбцов.*

```js
fixedColumnsStart: {
  type: Number,
  default: 0
}
```

### `fixedColumnsEnd`
Количество закрепленных столбцов с правого края.

*___Примечание:___ использовать, только если разрешена горизонтальная прокрутка.
Необходимо указать фиксированную ширину для закрепленных столбцов.*

```js
fixedColumnsEnd: {
  type: Number,
  default: 0
}
```

### `stickyHeader`
При вертикальной прокрутке таблицы заголовок будет закреплен

```js
stickyHeader: {
  type: Boolean,
  default: false
}
```

### `verticalBorders`
Добавляет отображение вертикальных границ ячеек таблицы. 

```js
verticalBorders: {
  type: Boolean,
  default: false
}
```

## Events

### `row-click`
Событие срабатывает при нажатии ЛКМ по строке, если пропс `rowsClickable` равен `true`.
Событие, переданное обработчику, содержит данные строки.

#### script
```vue
<script lang="js">
export default {
  name: 'SomeComponent',
  methods: {
    handleClickRow(row) {
      // to do smth.
    }
  }
}
</script>
```

#### template
```vue
<data-table
  source="local"
  :items="items"
  rows-clickable
  @row-click="handleClickRow"
>
```

### `update:selected-rows`
Событие срабатывает при выборе/отмене выбора строки.
Событие, переданное обработчику, содержит массив выбранных строк.
Пропс `rowSelection` должен быть равен `true`.

#### script
```vue
<script lang="js">
export default {
  name: 'SomeComponent',
  methods: {
    handleUpdateSelectedRows(rows) {
      // to do smth.
    }
  }
}
</script>
```

#### template
```vue
<data-table
  source="local"
  :items="items"
  row-selection
  @update:selected-rows="handleUpdateSelectedRows"
>
```

## Slots

### `topLeftBeforeActions`
Этот слот используется для отображения содержимого слева сверху от таблицы, слева от поля поиска.
```vue
<data-table ... >
  <template #topLeftBeforeActions>
    <div>Content here</div>
  </template>
</data-table>
```

### `topLeftAfterActions`
Этот слот используется для отображения содержимого слева сверху от таблицы, справа от поля поиска.
```vue
<data-table ... >
  <template #topLeftAfterActions>
    <div>Content here</div>
  </template>
</data-table>
```

### `topRight`
Этот слот используется для отображения содержимого справа сверху от таблицы.
```vue
<data-table ... >
  <template #topRight>
    <div>Content here</div>
  </template>
</data-table>
```

### `actions`
Этот слот используется для отображения содержимого в ячейках столбца действий. Слот предоставляет значение строки.

*___Примечание:___ событие с директивой `@click.stop` необходимо для предотвращения события клика строки.*

```vue
<data-table-column ... >
  <template #actions="{ index, item, number}">
    <div @click.stop>
      <div>Actions for row #{{ number }}:</div>
      <button id="delete" :data-id="item.id"></button>
    </div>
  </template>
</data-table-column>
```