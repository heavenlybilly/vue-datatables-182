# Руководство по обновлению

Здесь описан порядок обновления на более новые версии компонента, а так же указан список изменений и нововведений.
Под каждой версией указан порядок обновления до нее с предыдущей.

Для обновления компонента необходимо выполнить команду:
```
npm update @libs/vue-datatables-182
```

## v1.0.0

### Критические изменения
- Слоты `cell` и `actions` вместо значения `row` теперь передают объект `{ index, number, item }`;
- Значения пропса `source` компонента `DataTableColumn` теперь принимает значения `local` или `remote`;
- Теперь пакет предоставляется как плагин Vue:
```typescript
import Vue from 'vue'
import { DTPluginOptions, VueDatatables182 } from '@libs/vue-datatables-182'

Vue.use<DTPluginOptions>(VueDatatables182, {
  defaultMethod: 'GET',
  registerGlobally: false,
  csrfToken: window.token,
})
```

### Прочие изменения
- По умолчанию в компоненте используется метод `GET` для обращения к серверу.

*Примечание:*  
До некоторой версии `0.0.*` пропс `title` компонента `DataTableColumn` назывался `name`. Это тоже нужно учесть.