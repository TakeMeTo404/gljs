export type Compare<
  First extends number,
  Second extends number,
  Counter extends number[] = [],
> = Counter['length'] extends 17
  ? never
  : First extends Second
    ? 'equal'
    : Counter['length'] extends First
      ? 'less'
      : Counter['length'] extends Second
        ? 'greater'
        : Compare<First, Second, [...Counter, 0]>

export type NumbersZeroToN<N extends number, Acc extends number[] = []> = Acc['length'] extends 17
  ? never
  : Acc['length'] extends N
    ? Acc
    : NumbersZeroToN<N, [...Acc, Acc['length']]>

// 0 – inclusively, N – exclusively
export type AnyNumberZeroToN<N extends number> = NumbersZeroToN<N>[number]

export type Sum<A extends number, B extends number> = A extends 0 | 1 | 2 | 3 | 4
  ? B extends 0 | 1 | 2 | 3 | 4
    ? [...NumbersZeroToN<A>, ...NumbersZeroToN<B>]['length']
    : never
  : never
