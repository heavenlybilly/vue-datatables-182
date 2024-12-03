declare const window: {
  VUE_DATATABLES_182_GLOBALS: {
    token?: string
  }
} & Window

const VueDatatables182Setup = (params: { token?: string }) => {
  window.VUE_DATATABLES_182_GLOBALS = {
    token: params.token,
  }
}

export { VueDatatables182Setup }
