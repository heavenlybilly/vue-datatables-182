export class Logger {
  public static warn(...messages: (string | null)[]) {
    // eslint-disable-next-line no-console
    console.warn(
      '%cVue Datatables 182 [warn]:',
      'font-weight: 700;',
      ...messages.filter((msg) => msg !== null),
    )
  }

  public static error(...messages: (string | null)[]) {
    // eslint-disable-next-line no-console
    console.error(
      '%cVue Datatables 182 [error]:',
      'font-weight: 700;',
      ...messages.filter((msg) => msg !== null),
    )
  }
}
