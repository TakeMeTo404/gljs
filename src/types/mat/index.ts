import { ArrayOfLength } from '../utils/ts-array'
import { AnyNumberZeroToN } from '../utils/ts-number'
import { VecN } from '../vec'

type Operations<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> = {
  <T extends '+' | '-' | '/' | '*'>(
    op: T,
    other: T extends '+' | '-' | '/'
      ? number | MatRxC<RowCount, ColumnCount>
      : T extends '*'
        ? number | VecN<ColumnCount> | MatRxC<ColumnCount, 2 | 3 | 4>
        : never,
  ): T extends '+' | '-' | '/'
    ? MatRxC<RowCount, ColumnCount>
    : T extends '*'
      ? typeof other extends number
        ? MatRxC<RowCount, ColumnCount>
        : typeof other extends VecN<ColumnCount>
          ? VecN<RowCount>
          : typeof other extends MatRxC<ColumnCount, 2>
            ? MatRxC<RowCount, 2>
            : typeof other extends MatRxC<ColumnCount, 3>
              ? MatRxC<RowCount, 3>
              : typeof other extends MatRxC<ColumnCount, 4>
                ? MatRxC<RowCount, 4>
                : unknown
      : unknown

  multiply: <T extends number | VecN<ColumnCount> | MatRxC<ColumnCount, 2 | 3 | 4>>(
    other: T,
  ) => T extends number
    ? MatRxC<RowCount, ColumnCount>
    : T extends VecN<ColumnCount>
      ? VecN<RowCount>
      : T extends MatRxC<ColumnCount, 2>
        ? MatRxC<RowCount, 2>
        : T extends MatRxC<ColumnCount, 3>
          ? MatRxC<RowCount, 3>
          : T extends MatRxC<ColumnCount, 4>
            ? MatRxC<RowCount, 4>
            : unknown

  add: (other: number | MatRxC<RowCount, ColumnCount>) => MatRxC<RowCount, ColumnCount>
  substract: (other: number | MatRxC<RowCount, ColumnCount>) => MatRxC<RowCount, ColumnCount>
  divide: (other: number | MatRxC<RowCount, ColumnCount>) => MatRxC<RowCount, ColumnCount>
}

// M – rows, N – columns
type Mat<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> = {
  values: ArrayOfLength<ArrayOfLength<number, ColumnCount>, RowCount>

  copy: () => MatRxC<RowCount, ColumnCount>
} & Record<AnyNumberZeroToN<RowCount>, VecN<ColumnCount>> &
  Operations<RowCount, ColumnCount>

export type Mat2 = Mat<2, 2>
export type Mat3 = Mat<3, 3>
export type Mat4 = Mat<4, 4>

export type Mat2x3 = Mat<2, 3>
export type Mat3x2 = Mat<3, 2>

export type Mat2x4 = Mat<2, 4>
export type Mat4x2 = Mat<4, 2>

export type Mat3x4 = Mat<3, 4>
export type Mat4x3 = Mat<4, 3>

export type MatRxC<M extends number, N extends number> = M extends 2
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
