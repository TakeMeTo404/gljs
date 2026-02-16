export type Compare<
  First extends number,
  Second extends number,
  Counter extends number[] = [],
> = Counter['length'] extends 22
  ? never
  : First extends Second
    ? 'equal'
    : Counter['length'] extends First
      ? 'less'
      : Counter['length'] extends Second
        ? 'greater'
        : Compare<First, Second, [...Counter, 0]>

export type NumbersZeroToN<N extends number, Acc extends number[] = []> = Acc['length'] extends 22
  ? never
  : Acc['length'] extends N
    ? Acc
    : NumbersZeroToN<N, [...Acc, Acc['length']]>

// 0 – inclusively, N – exclusively
export type AnyNumberZeroToN<N extends number> = NumbersZeroToN<N>[number]

export type Sum<A extends number, B extends number> = A extends
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  ? B extends 0 | 1 | 2 | 3 | 4
    ? [...NumbersZeroToN<A>, ...NumbersZeroToN<B>]['length']
    : never
  : never

export type Multiply<A extends 2 | 3 | 4, B extends 2 | 3 | 4> = [A, B] extends [2, 2]
  ? 4
  : [A, B] extends [2, 3]
    ? 6
    : [A, B] extends [3, 2]
      ? 6
      : [A, B] extends [3, 3]
        ? 9
        : [A, B] extends [2, 4]
          ? 8
          : [A, B] extends [4, 2]
            ? 8
            : [A, B] extends [3, 4]
              ? 12
              : [A, B] extends [4, 3]
                ? 12
                : [A, B] extends [4, 4]
                  ? 16
                  : never
