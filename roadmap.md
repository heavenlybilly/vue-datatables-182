# Roadmap: vue-datatables-182

## Phase 1 — Bug Fixes

### 1.1 Array mutation on local sort (fixed)
- **File:** `src/components/data/useLocalAdapter.ts:53`
- `rowItems.sort(...)` mutates the source array in-place
- Fix: `rowItems = [...rowItems].sort(...)`

### 1.2 Wrong `:key` in table rows (fixed)
- **File:** `src/components/layout/table/TableView.vue:86`
- `:key="state.rowKeySelector(row)"` passes `{ number, item }` instead of `RowItem`
- Fix: `:key="state.rowKeySelector(row.item)"`

### 1.3 Props mutation in normalize-slot-result (won't fix)
- **File:** `src/components/columns/normalize-slot-result.ts:23-30`
- Directly mutates `tableColumnProps.searchable` and `.sortable`
- Fix: spread into a new object before modifying

### 1.4 `allVisibleSelected` logic error (won't fix)
- **File:** `src/components/controller/useController.ts:43-45`
- Compares only counts, not actual keys — false positive when selected keys are from another page
- Fix: check that every visible item is in `selectedKeysSet`

### 1.5 Multiple `setTableData` calls in localAdapter (fixed)
- **File:** `src/components/data/useLocalAdapter.ts:12,42,76`
- Three sequential calls trigger selection reconciliation logic each time
- Fix: collect `total`, `filtered`, `items` and call `setTableData` once

---

## Phase 2 — Remote Adapter Fixes

### 2.1 Missing `Content-Type` header (fixed)
- **File:** `src/components/data/useRemoteAdapter.ts:72-77`
- JSON body sent without `Content-Type: application/json`
- Fix: add header when `requestBody` is present

### 2.2 Hardcoded HTTP method (won't fix)
- **File:** `src/components/data/useRemoteAdapter.ts:86`
- `method: 'post'` is hardcoded, ignoring user configuration
- Fix: add optional `method` field to `BuiltRequest` type, default to `'POST'`

### 2.3 No cleanup on unmount (in progress)
- **File:** `src/components/data/useRemoteAdapter.ts`
- In-flight requests and debounce timers are not cancelled on component destroy
- Fix: expose a `destroy()` method, call it from `onBeforeUnmount` in `DataTable.vue`

---

## Phase 3 — Architecture: Replace `onUpdated` (planned)

### 3.1 Replace onUpdated with targeted watchers
- **File:** `src/components/DataTable.vue:184-187`
- `onUpdated` fires on every re-render → unnecessary `normalize()` + `dataProvider.apply()` cycles
- Fix:
  - Use `watch` on relevant props (items, url, filter, pagination, search, sort, selection props) to call `syncData()`
  - Use `watch` on slots (or keep `onUpdated` only for `rebuildColumns` with its existing snapshot guard)
  - Keep `onMounted` for initial load

---

## Phase 4 — Missing Layout Components (planned)

`vars.scss` already defines color variables for these but the components don't exist yet.

### 4.1 NoDataPlug component
- **Path:** `src/components/layout/table/plugs/NoDataPlug.vue`
- Shown when `tableData.items` is empty and not loading
- Uses `$no-data-plug-*` vars from `vars.scss`
- Simple centered message: icon + text

### 4.2 ErrorPlug component
- **Path:** `src/components/layout/table/plugs/ErrorPlug.vue`
- Shown when `core.state.error` is set
- Uses `$error-plug-*` vars from `vars.scss`
- Shows error message + optional retry button calling `handlers.reload()`

### 4.3 Integrate plugs into TableView
- **File:** `src/components/layout/table/TableView.vue`
- Add conditional rendering: error → ErrorPlug, empty → NoDataPlug, else → table rows

---

## Phase 5 — Style Polish (planned)

### 5.1 Table-level styles
- **File:** `src/components/layout/table/TableView.vue`
- Add border-radius from `$table-border-radius`, outer border from `$table-border-color`
- `overflow: hidden` for rounded corners on the table container
- `scrollX` support: `overflow-x: auto` when enabled

### 5.2 Striped rows
- **File:** `src/components/layout/table/body/TableRow.vue`
- Add `nth-child(even)` background when `striped` prop is true
- Use a subtle alternating color derived from existing vars

### 5.3 BodyCellData and BodyCellNumbering
- **Files:** `src/components/layout/table/body/BodyCellData.vue`, `BodyCellNumbering.vue`
- These have empty `<style>` blocks
- Add text overflow handling (ellipsis), font-size consistency, color from vars

### 5.4 Root and TableView wrappers
- **Files:** `Root.vue`, `TableView.vue`
- Both have empty `<style>` blocks
- Add structural styles: font-family, base font-size, color resets

### 5.5 Sticky header + scrollX integration
- **File:** `src/components/layout/table/TableView.vue`
- When `stickyHeader` is enabled: wrap table in a scrollable container with sticky header row
- When `scrollX` is enabled: container gets `overflow-x: auto` with min-width behavior

---

## Phase 6 — Final Verification (planned)

### 6.1 Playground testing
- Run `npm run playground`, verify all features work visually:
  - Local data: search, sort, paginate, select rows
  - Remote data: fetch, loading shimmer, error state, empty state
  - Sticky columns, vertical borders, striped rows, numbering
  - Row click, select on row click, select all

### 6.2 Build check
- `npm run check:code` — types + tests + lint + stylelint
- `npm run build` — verify clean Rollup output (JS + CSS + types)

### 6.3 Style review
- Visual check in playground for consistency, spacing, transitions, hover states
