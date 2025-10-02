import { ArrayOfLength } from '../utils/ts-array'
import { VecN } from '../vec'

type VecOrArr<N extends 2 | 3 | 4> = VecN<N> | ArrayOfLength<number, N>

// TODO: решить, нужен ли конструктор:
// – с диагональю
// – с колонками, или лучше делать transpose(vec3(7), vec3(2))
export type MatCreateArgs<RowCount extends 2 | 3 | 4, ColumnCount extends 2 | 3 | 4> =
  | [number]
  | ArrayOfLength<VecOrArr<ColumnCount>, RowCount>
