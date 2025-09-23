# Vue Datatables 182
Vue Datatables 182 — это компонент для отображения таблиц с расширенными возможностями.
Компонент поддерживает следующие возможности:

- Поиск
- Пагинацию
- Получение данных с сервера
- Настройку с помощью слотов

## Содержание
- [Для разработки](#для-разработки)
- [Начало работы](#начало-работы)
- [Структура компонентов](#структура-компонентов)
- [Описание компонентов](#описание-компонентов)
- [Руководство по обновлению](#руководство-по-обновлению)

## Для разработки
Необходимо выполнить команды
```sh
task build
task up
task bash

# в контейнере
npm install
npm run playground
```

## Установка

#### Добавление реестра
```bash
echo @libs:registry=https://gitlab.corp/api/v4/packages/npm/ >> .npmrc
echo strict-ssl=false >> .npmrc
```

#### Установка пакета
```bash
npm i @libs/vue-datatables-182
```

#### Использование
Регистрация плагина:
```js
import Vue from 'vue'
import { DTPluginOptions, VueDatatables182 } from '@libs/vue-datatables-182'
import "vue-datatables-182/dist/index.css"

Vue.use<DTPluginOptions>(VueDatatables182, {
  defaultMethod: 'GET',
  registerGlobally: false,
  csrfToken: window.token,
})
```

Использование компонента:
```vue
<script lang="js">
import { DataTable, DataTableColumn } from 'vue-datatables-182'

export default {
  name: 'SomeComponent',
  components: { DataTable, DataTableColumn },
  data() {
    return {
      items: [
        { name: 'New-York', order: 1 },
        { name: 'Moscow', order: 2 },
        { name: 'London', order: 3 },
        { name: 'Paris', order: 4 },
        { name: 'Berlin', order: 5 },
      ],
    }
  },
}
</script>

<template>
  <!-- данные из массива -->
  <data-table
    source="local"
    :items="items"
    numbering
    row-selection
  >
    <data-table-column
      field="name"
      orderable
      searchable
      title="Name"
    />
    <data-table-column
      field="order"
      orderable
      text-align="center"
      title="Order"
      width="200px"
    />
  </data-table>

  <!-- данные с сервера -->
  <data-table
    source="remote"
    url="/example-table"
    numbering
    row-selection
  >
    <data-table-column
      field="name"
      orderable
      searchable
      title="Name"
    />
    <data-table-column
      field="order"
      orderable
      text-align="center"
      title="Order"
      width="200px"
    />
  </data-table>
</template>
```

___

## Структура компонентов

Пунктирные прямоугольники обозначают области, соответствующие слотам. Слоты компонента `DataTable` выделены зелёным цветом, слоты компонента `DataTableColumn` — оранжевым.

![DataTable](./docs/ui-highlight.jpg)

___

## Описание компонентов

- [DataTable](./docs/data-table.md)
- [DataTableColumn](./docs/data-table-column.md)

## Руководство по обновлению

[Здесь](./docs/migration-guide.md) описан порядок обновления компонента.