# DataTableColumn

## Props

### `field`
Название свойства, значение которого будет отображено в ячейках данного столбца.

```js
field: {
  type: String,
  required: true
}
```

### `title`
Заголовок столбца.

```js
title: {
  type: String,
  required: true
}
```

### `orderable`
Разрешить сортировку строк по данному столбцу.

```js
orderable: {
  type: Boolean,
  default: false
}
```

### `searchable`
Разрешить поиск по данному столбцу.

```js
searchable: {
  type: Boolean,
  default: false
}
```

### `width`
Фиксированная ширина столбца. Необходимо указывать валидные CSS-значения свойства `width`.
Например, `width="120px"`.

**Чтобы значение этого параметра устанавливало точное значение ширины столбца:**
1. Хотя бы у одного из столбцов не должна быть указана ширина;
2. Должна быть разрешена горизонтальная прокрутка таблицы,
   сумма ширины всех столбцов должна быть больше ширины таблицы.

```js
width: {
  type: String, 
  required: false,
  default: undefined
}
```

### `textAlign`
Выравнивание текста в столбце таблицы. Доступные значения: `left`, `right` и `center`.

*___Примечание:___ если отображение содержимого ячеек столбца задается с помощью слота,
это свойство может не иметь ожидаемого эффекта.*

```js
textAlign: {
  type: String,
  default: undefined
}
```



## Slots

### `cell`
Этот слот используется для отображения содержимого в пользовательских ячейках столбца.
Слот предоставляет значение строки.

```vue
<data-table-column
  field="name"
  orderable
  searchable
  title="Name"
>
  <template #cell="{ index, item, number}">
    <div>
      <div>This is row #{{ number }}</div>
      <div>Title: {{ item.title }}</div>
    </div>
  </template>
</data-table-column>
```