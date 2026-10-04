import { AnyNumberZeroToN } from '../utils/ts-number'
import { VecN } from '../vec/vec'

type OtherArg<ColumnCount extends 2 | 3 | 4, RowCount extends 2 | 3 | 4, Op> = Op extends '*'
  ? number | VecN<ColumnCount> | MatCxR<2 | 3 | 4, ColumnCount>
  : number | MatCxR<ColumnCount, RowCount>

type CallableMatrix<ColumnCount extends 2 | 3 | 4, RowCount extends 2 | 3 | 4> = {
  <Op extends '+' | '-' | '/' | '*', Other extends OtherArg<ColumnCount, RowCount, Op>>(
    op: Op,
    other: Other,
  ): Op extends '+' | '-' | '/'
    ? MatCxR<ColumnCount, RowCount>
    : Op extends '*'
      ? Other extends number
        ? MatCxR<ColumnCount, RowCount>
        : Other extends VecN<ColumnCount>
          ? VecN<RowCount>
          : Other extends MatCxR<2, ColumnCount>
            ? MatCxR<2, RowCount>
            : Other extends MatCxR<3, ColumnCount>
              ? MatCxR<3, RowCount>
              : Other extends MatCxR<4, ColumnCount>
                ? MatCxR<4, RowCount>
                : unknown
      : unknown
}

// m[j] – column j (like in GLSL), m.rows[i] – row i
type MatrixIndexing<ColumnCount extends 2 | 3 | 4, RowCount extends 2 | 3 | 4> = Record<
  AnyNumberZeroToN<ColumnCount>,
  VecN<RowCount>
> & {
  rows: Record<AnyNumberZeroToN<RowCount>, VecN<ColumnCount>>
}

// GLSL naming: matCxR – C columns, R rows
type Mat<ColumnCount extends 2 | 3 | 4, RowCount extends 2 | 3 | 4> = {
  copy: () => MatCxR<ColumnCount, RowCount>
} & MatrixIndexing<ColumnCount, RowCount> &
  CallableMatrix<ColumnCount, RowCount>

export type Mat2 = Mat<2, 2>
export type Mat3 = Mat<3, 3>
export type Mat4 = Mat<4, 4>

export type Mat2x3 = Mat<2, 3>
export type Mat3x2 = Mat<3, 2>

export type Mat2x4 = Mat<2, 4>
export type Mat4x2 = Mat<4, 2>

export type Mat3x4 = Mat<3, 4>
export type Mat4x3 = Mat<4, 3>

export type AnyMat = Mat2 | Mat2x3 | Mat2x4 | Mat3x2 | Mat3 | Mat3x4 | Mat4x2 | Mat4x3 | Mat4

export type ColumnsCount<M extends AnyMat> = M extends Mat2 | Mat2x3 | Mat2x4
  ? 2
  : M extends Mat3x2 | Mat3 | Mat3x4
    ? 3
    : M extends Mat4x2 | Mat4x3 | Mat4
      ? 4
      : never

export type RowsCount<M extends AnyMat> = M extends Mat2 | Mat3x2 | Mat4x2
  ? 2
  : M extends Mat2x3 | Mat3 | Mat4x3
    ? 3
    : M extends Mat2x4 | Mat3x4 | Mat4
      ? 4
      : never

export type MatCxR<C extends number, R extends number> = C extends 2
  ? R extends 2
    ? Mat2
    : R extends 3
      ? Mat2x3
      : R extends 4
        ? Mat2x4
        : never
  : C extends 3
    ? R extends 2
      ? Mat3x2
      : R extends 3
        ? Mat3
        : R extends 4
          ? Mat3x4
          : never
    : C extends 4
      ? R extends 2
        ? Mat4x2
        : R extends 3
          ? Mat4x3
          : R extends 4
            ? Mat4
            : never
      : never
