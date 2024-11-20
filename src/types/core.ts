export type DefineComponent<
  P = NonNullable<unknown>,
  S = NonNullable<unknown>,
  E = NonNullable<unknown>,
  M = NonNullable<unknown>,
> = {
  new (): {
    $props: P
    $slots: S
    $emit: E
  } & M
}

type ObjectEmitsOptions = {
  [event: string]: (...args: any[]) => void | boolean
}

declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

export declare type EmitFn<
  Options = ObjectEmitsOptions,
  Event extends keyof Options = keyof Options,
> =
  Options extends Array<infer V>
    ? (event: V, ...args: any[]) => void
    : NonNullable<unknown> extends Options
      ? (event: string, ...args: any[]) => void
      : UnionToIntersection<
          {
            [key in Event]: Options[key] extends (...args: infer Args) => any
              ? (event: key, ...args: Args) => void
              : (event: key, ...args: any[]) => void
          }[Event]
        >
