import { ArrayOfLength } from '../utils/ts-array'
import { Equal, Expect } from '../utils/ts-debug'
import { Compare, Multiply, Sum } from '../utils/ts-number'
import { Vec2, Vec3, Vec4, VecN } from '../vec'
import { MatRxC } from './mat'

type IsOneOf<T extends unknown[], X extends any> = T extends [infer Head, ...infer Tail]
  ? Equal<X, Head> extends true
    ? true
    : IsOneOf<Tail, X>
  : false

type InnerComponentsCount<X> = X extends number
  ? 1
  : X extends Vec2
    ? 2
    : X extends Vec3
      ? 3
      : X extends Vec4
        ? 4
        : never

type ComponentsCount<X> =
  IsOneOf<[1, 2, 3, 4], InnerComponentsCount<X>> extends true ? InnerComponentsCount<X> : never

type CountComponents<T extends unknown[], Acc extends number> =
  Compare<Acc, 17> extends 'less'
    ? T extends [infer Head, ...infer Tail]
      ? ComponentsCount<Head> extends never
        ? never
        : CountComponents<Tail, Sum<Acc, ComponentsCount<Head>>>
      : Acc
    : never

type InnerCanCountComponents<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? ComponentsCount<Head> extends number
    ? InnerCanCountComponents<Tail>
    : false
  : true

type CanCountComponents<T extends unknown[]> =
  IsOneOf<[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], T['length']> extends true
    ? InnerCanCountComponents<T>
    : false

type Tests = [
  Expect<Equal<IsOneOf<[0, 1, 2, 3, 4, 5], 4>, true>>,
  Expect<Equal<IsOneOf<[0, 1, 2, 3, 4, 5], 6>, false>>,
  Expect<Equal<CountComponents<[], 0>, 0>>,

  Expect<Equal<CanCountComponents<[]>, true>>,
  Expect<Equal<CanCountComponents<[1]>, true>>,
  Expect<Equal<CanCountComponents<[number]>, true>>,
  Expect<Equal<CanCountComponents<[Vec2]>, true>>,
  Expect<Equal<CanCountComponents<[Vec2, Vec4]>, true>>,
]

export type MatCreateArgs<
  RowCount extends 2 | 3 | 4,
  ColumnCount extends 2 | 3 | 4,
  Args extends unknown[],
> = Args extends [number]
  ? Args
  : Args extends [MatRxC<infer R, infer C>]
    ? Args
    : Args extends Array<number | Vec2 | Vec3 | Vec4>
      ? CanCountComponents<Args> extends true
        ? CountComponents<Args, 0> extends Multiply<RowCount, ColumnCount>
          ? Args
          : never
        : Args
      : never
