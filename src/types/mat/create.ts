import { Equal } from '../utils/ts-debug'
import { Compare, Multiply } from '../utils/ts-number'
import { Vec2, Vec3, Vec4 } from '../vec'
import { CanCountComponents, CountComponents } from '../vec/create'
import { MatRxC } from './mat'

type IsDiagonalVector<
  RowCount extends 2 | 3 | 4,
  ColumnCount extends 2 | 3 | 4,
  Args extends unknown[],
> = Args extends [Vec2]
  ? Equal<Compare<RowCount, ColumnCount> extends 'less' ? RowCount : ColumnCount, 2>
  : Args extends [Vec3]
    ? Equal<Compare<RowCount, ColumnCount> extends 'less' ? RowCount : ColumnCount, 3>
    : Args extends [Vec2]
      ? Equal<Compare<RowCount, ColumnCount> extends 'less' ? RowCount : ColumnCount, 4>
      : false

export type MatCreateArgs<
  RowCount extends 2 | 3 | 4,
  ColumnCount extends 2 | 3 | 4,
  Args extends unknown[],
> = Args extends [number]
  ? Args
  : Args extends [MatRxC<any, any>]
    ? Args
    : IsDiagonalVector<RowCount, ColumnCount, Args> extends true
      ? Args
      : Args extends Array<number | Vec2 | Vec3 | Vec4>
        ? CanCountComponents<Args> extends true
          ? CountComponents<Args, 0> extends Multiply<RowCount, ColumnCount>
            ? Args
            : never
          : Args
        : never
