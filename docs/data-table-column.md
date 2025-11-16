# DataTableColumn

## Props

### `field`
The name of the property whose value will be displayed in the cells of this column.

```js  
field: {  
  type: String,  
  required: true  
}  
```  

### `title`
Column header.

```js  
title: {  
  type: String,  
  required: true  
}  
```  

### `orderable`
Allow sorting rows by this column.

```js  
orderable: {  
  type: Boolean,  
  default: false  
}  
```  

### `searchable`
Allow searching by this column.

```js  
searchable: {  
  type: Boolean,  
  default: false  
}  
```  

### `width`
Fixed column width. You must provide valid CSS values for the `width` property.  
For example: `width="120px"`.

**For this parameter to set an exact column width:**
1. At least one column must not have a width specified;
2. Horizontal scrolling must be enabled,  
   and the total width of all columns must exceed the table width.

```js  
width: {  
  type: String,  
  required: false,  
  default: undefined  
}  
```  

### `textAlign`
Text alignment in the column. Allowed values: `left`, `right`, and `center`.

*Note: if cell content is rendered through a slot, this property may not have the expected effect.*

```js  
textAlign: {  
  type: String,  
  default: undefined  
}  
```  

## Slots

### `cell`
This slot is used to render custom cell content.  
The slot provides row data.

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