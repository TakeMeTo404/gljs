import { ArrayOfLength } from '../utils/ts-array'
import { AnyNumberZeroToN } from '../utils/ts-number'
import { VecN } from '../vec'

type SquareMatrix<M extends 2 | 3 | 4, N extends 2 | 3 | 4> = M extends N
  ? N extends M
    ? {
        inverse: () => MatMxN<M, N>
        determinant: () => number
      }
    : {}
  : {}

// M – rows, N – columns
export type Mat<M extends 2 | 3 | 4, N extends 2 | 3 | 4 = M> = {
  values: ArrayOfLength<ArrayOfLength<number, N>, M>

  copy: () => MatMxN<M, N>

  transpose: () => MatMxN<N, M>
} & Record<AnyNumberZeroToN<M>, VecN<N>> &
  SquareMatrix<M, N>

export type Mat2 = Mat<2>
export type Mat3 = Mat<3>
export type Mat4 = Mat<4>

export type Mat2x3 = Mat<2, 3>
export type Mat3x2 = Mat<3, 2>

export type Mat2x4 = Mat<2, 4>
export type Mat4x2 = Mat<4, 2>

export type Mat3x4 = Mat<3, 4>
export type Mat4x3 = Mat<4, 3>

export type MatMxN<M extends number, N extends number> = M extends 2
  ? N extends 2
    ? Mat2
    : N extends 3
      ? Mat2x3
      : N extends 4
        ? Mat2x4
        : never
  : M extends 3
    ? N extends 2
      ? Mat3x2
      : N extends 3
        ? Mat3
        : N extends 4
          ? Mat3x4
          : never
    : M extends 4
      ? N extends 2
        ? Mat4x2
        : N extends 3
          ? Mat4x3
          : N extends 4
            ? Mat4
            : never
      : never

export type MatCreateArgs<M extends 2 | 3 | 4, N extends 2 | 3 | 4> =
  | [number]
  | ArrayOfLength<VecN<N>, M>
