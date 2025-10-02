import { ArrayOfLength } from '../utils/ts-array'
import { AnyNumberZeroToN } from '../utils/ts-number'
import { VecN } from '../vec/vec'

type OtherArg<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4, Op> = Op extends '*'
  ? number | VecN<ColumnCount> | MatRxC<ColumnCount, 2 | 3 | 4>
  : number | MatRxC<RowCount, ColumnCount>

type CallableMatrix<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> = {
  <Op extends '+' | '-' | '/' | '*', Other extends OtherArg<RowCount, ColumnCount, Op>>(
    op: Op,
    other: Other,
  ): Op extends '+' | '-' | '/'
    ? MatRxC<RowCount, ColumnCount>
    : Op extends '*'
      ? Other extends number
        ? MatRxC<RowCount, ColumnCount>
        : Other extends VecN<ColumnCount>
          ? VecN<RowCount>
          : Other extends MatRxC<ColumnCount, 2>
            ? MatRxC<RowCount, 2>
            : Other extends MatRxC<ColumnCount, 3>
              ? MatRxC<RowCount, 3>
              : Other extends MatRxC<ColumnCount, 4>
                ? MatRxC<RowCount, 4>
                : unknown
      : unknown
}

type MatrixIndexing<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> = Record<
  AnyNumberZeroToN<RowCount>,
  VecN<ColumnCount>
> & {
  columns: Record<AnyNumberZeroToN<ColumnCount>, VecN<RowCount>>
}

// M – rows, N – columns
type Mat<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> = {
  copy: () => MatRxC<RowCount, ColumnCount>
} & MatrixIndexing<RowCount, ColumnCount> &
  CallableMatrix<RowCount, ColumnCount>

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
