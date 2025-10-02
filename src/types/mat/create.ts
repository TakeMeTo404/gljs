import { ArrayOfLength } from '../utils/ts-array'
import { VecN } from '../vec'

type VecOrArr<N extends 2 | 3 | 4> = VecN<N> | ArrayOfLength<number, N>

export type MatCreateArgs<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> =
  | [number]
  | ArrayOfLength<VecOrArr<ColumnCount>, RowCount>
  | [{ rows: ArrayOfLength<VecOrArr<ColumnCount>, RowCount> }]
  | [{ columns: ArrayOfLength<VecOrArr<RowCount>, ColumnCount> }]
