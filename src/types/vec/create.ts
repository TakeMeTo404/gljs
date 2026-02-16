import { ArrayOfLength } from '../utils/ts-array'
import { Equal, Expect } from '../utils/ts-debug'
import { Compare, Multiply, Sum } from '../utils/ts-number'
import { Vec2, Vec3, Vec4, VecN } from '../vec'

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

export type CountComponents<T extends unknown[], Acc extends number> =
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

export type CanCountComponents<T extends unknown[]> =
  IsOneOf<[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], T['length']> extends true
    ? InnerCanCountComponents<T>
    : false

export type VecCreateArgs<
  N extends 2 | 3 | 4,
  Args extends (number | Vec2 | Vec3 | Vec4)[],
> = Args extends [number]
  ? Args
  : CanCountComponents<Args> extends true
    ? CountComponents<Args, 0> extends N
      ? Args
      : never
    : Args
