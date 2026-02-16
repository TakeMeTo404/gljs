export type Expect<T extends true> = T

export type Not<_ extends false> = true

type ShapesEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false

export type Equal<T, U> =
  ShapesEqual<T, U> extends true
    ? ShapesEqual<keyof T, keyof U> extends true
      ? true
      : false
    : false

export type Assignable<T, U> = T extends U ? true : false
