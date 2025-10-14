import { Multiply } from '../utils/ts-number'
import { Vec2, Vec3, Vec4 } from '../vec'
import { CanCountComponents, CountComponents } from '../vec/create'
import { MatRxC } from './mat'

export type MatCreateArgs<
  RowCount extends 2 | 3 | 4,
  ColumnCount extends 2 | 3 | 4,
  Args extends unknown[],
> = Args extends [number]
  ? Args
  : Args extends [MatRxC<any, any>]
    ? Args
    : Args extends Array<number | Vec2 | Vec3 | Vec4>
      ? CanCountComponents<Args> extends true
        ? CountComponents<Args, 0> extends Multiply<RowCount, ColumnCount>
          ? Args
          : never
        : Args
      : never
