# DataTable
## Props

### Data

### `source`
Data source. Allowed values: `local` and `remote`.

```js
source: {
  type: String,
  default: 'remote'
}
```

### `url`
URL for loading data. Use only with `source="remote"`.

```js
url: {
  type: String,
  default: null
}
```

### `items`
Array of data to display. Use only with `source="local"`.

```js
items: {
  type: Array,
  default: () => []
}
```

### Pagination

### `pagination`
Enables table pagination.

```js
pagination: {
  type: Boolean,
  default: true
}
```

### `rowsPerPageOptions`
List of options for selecting rows per page.

```js
rowsPerPageOptions: {
  type: Array,
  default: () => [5, 10, 25, 50, 100]
}
```

### `rowsPerPageCount`
Number of rows per page. The value must exist in `rowsPerPageOptions`.

```js
rowsPerPageCount: {
  type: Number,
  default: 10
}
```

### `showRangeInfo`
Show record count on page.

```js
showRangeInfo: {
  type: Boolean,
  default: true
}
```

### Search

### `searching`
Enables search.

```js
searching: {
  type: Boolean,
  default: true
}
```

### Sorting

### `orderBy`
Column name used for default sorting.

```js
orderBy: {
  type: String,
  default: null
}
```

### `orderDirection`
Default sorting order. Allowed values: `asc` and `desc`.

```js
orderDirection: {
  type: String,
  default: 'asc'
}
```

### General

### `actions`
Adds a column with actions.

*Note: the content of action cells must be added via the `actions` slot.*

```js
actions: {
  type: Boolean,
  default: false
}
```

### `numbering`
Adds a column with row numbering.

```js
numbering: {
  type: Boolean,
  default: false
}
```

### `rowSelection`
Adds a column with checkboxes for selecting rows.

```js
rowSelection: {
  type: Boolean,
  default: false
}
```

### `disallowSelectAll`
Prevents selecting all rows at once.

```js
disallowSelectAll: {
  type: Boolean,
  default: false,
}
```

### `rowsClickable`
Enables handling the `@click` event on a table row.

```js
rowsClickable: {
  type: Boolean,
  default: false
}
```

### `selectOnRowClick`
Allows selecting rows by clicking with LMB.

*Note: requires both `rowSelection` and `rowsClickable` to be `true`.*

```js
selectOnRowClick: {
  type: Boolean,
  default: false
}
```

### Appearance

### `scrollX`
Enables horizontal scrolling.

```js
scrollX: {
  type: Boolean,
  default: false
}
```

### `fixedColumnsStart`
Number of fixed columns on the left.

*Note: use only when horizontal scrolling is enabled.
A fixed width must be specified for fixed columns.*

```js
fixedColumnsStart: {
  type: Number,
  default: 0
}
```

### `fixedColumnsEnd`
Number of fixed columns on the right.

*Note: use only when horizontal scrolling is enabled.
A fixed width must be specified for fixed columns.*

```js
fixedColumnsEnd: {
  type: Number,
  default: 0
}
```

### `stickyHeader`
Fixes the header during vertical scrolling.

```js
stickyHeader: {
  type: Boolean,
  default: false
}
```

### `verticalBorders`
Shows vertical cell borders.

```js
verticalBorders: {
  type: Boolean,
  default: false
}
```

## Events

### `row-click`
Triggered when clicking a row if `rowsClickable` is `true`.
The emitted event contains row data.

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
Triggered when selecting or deselecting a row.
The emitted event contains an array of selected rows.
Requires `rowSelection` to be `true`.

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
Used to display content to the left above the table, left of the search field.
```vue
<data-table ... >
  <template #topLeftBeforeActions>
    <div>Content here</div>
  </template>
</data-table>
```

### `topLeftAfterActions`
Used to display content to the left above the table, right of the search field.
```vue
<data-table ... >
  <template #topLeftAfterActions>
    <div>Content here</div>
  </template>
</data-table>
```

### `topRight`
Used to display content to the right above the table.
```vue
<data-table ... >
  <template #topRight>
    <div>Content here</div>
  </template>
</data-table>
```

### `actions`
Used to display content inside action column cells. Slot provides row data.

*Note: you must use `@click.stop` to prevent triggering the row click event.*

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

