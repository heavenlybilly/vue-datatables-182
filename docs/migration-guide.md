# Upgrade Guide

This section describes the procedure for updating to newer versions of the component, as well as the list of changes and new features.  
Each version includes instructions for updating from the previous one.

To update the component, run:
```  
npm update vue-datatables-182  
```  

## v1.2.4

### Breaking changes
- The `cell` and `actions` slots now pass an object `{ index, number, item }` instead of `row`;
- The `source` prop of the `DataTableColumn` component now accepts values `local` or `remote`;
- The package is now provided as a Vue plugin:
```typescript  
import Vue from 'vue'  
import { DTPluginOptions, VueDatatables182 } from 'vue-datatables-182'  
  
Vue.use<DTPluginOptions>(VueDatatables182, {  
  defaultMethod: 'GET',  
  registerGlobally: false,  
  csrfToken: window.token,  
})  
```  

### Other changes
- By default, the `GET` method is now used to communicate with the server.

*Note:*  
In earlier `0.0.*` versions, the `title` prop of the `DataTableColumn` component was called `name`. This should also be taken into account.  