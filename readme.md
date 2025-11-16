# Vue Datatables 182
Vue Datatables 182 is a component that provides a table with enhanced capabilities. This component supports:

- Searching
- Remote data
- Pagination
- Customizing with slots

## Contents
- [For development](#for-development)
- [Getting started](#getting-started)
- [Component structure](#component-structure)
- [Components description](#components-description)
- [Upgrade guide](#upgrade-guide)

## For development
You need to run the commands
```sh
cp .env.example .env

task build
task up
task bash

# inside the container
npm install
npm run playground
```

## Installation

#### Package installation
```bash
npm i vue-datatables-182
```

#### Usage
Plugin registration:
```js
import Vue from 'vue'
import { DTPluginOptions, VueDatatables182 } from 'vue-datatables-182'
import "vue-datatables-182/dist/index.css"

Vue.use<DTPluginOptions>(VueDatatables182, {
  defaultMethod: 'GET',
  registerGlobally: false,
  csrfToken: window.token,
})
```

Component usage:
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
  <!-- data from an array -->
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

  <!-- data from the server -->
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

## Component structure

Dashed rectangles indicate areas that correspond to slots. Slots of the `DataTable` component are highlighted in green, slots of the `DataTableColumn` component — in orange.

![DataTable](./docs/ui-highlight.jpg)

___

## Components description

- [DataTable](./docs/data-table.md)
- [DataTableColumn](./docs/data-table-column.md)

## Upgrade guide

The update procedure for the component is described [here](./docs/migration-guide.md).
