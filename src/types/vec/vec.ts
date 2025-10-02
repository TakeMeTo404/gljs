import { Length } from '../utils/ts-string'
import { ArrayOfLength } from '../utils/ts-array'
import { AnyNumberZeroToN } from '../utils/ts-number'
import { Get_XYZW_Selection, Get_RGBA_Selection } from './get'
import { Set_XYZW_Selection, Set_RGBA_Selection } from './set'

type BasicOperation = '+' | '-' | '*' | '/'
type BasicAssignOperation = `${BasicOperation}=`

export type CallableVector<N extends 2 | 3 | 4> = {
  <T extends BasicOperation | BasicAssignOperation>(
    op: T,
    other: number | VecN<N>,
  ): T extends BasicOperation ? VecN<N> : void
}

type Vec<N extends 2 | 3 | 4> = {
  get: <T extends string>(
    selection: Get_XYZW_Selection<T, N> | Get_RGBA_Selection<T, N>,
  ) => VecN<Length<T>>

  set: <T extends string>(
    selection: Set_XYZW_Selection<T, N> | Set_RGBA_Selection<T, N>,
    value: VecN<Length<T>>,
  ) => void

  copy: () => VecN<N>
} & Iterable<number> & CallableVector<N> &
  Record<AnyNumberZeroToN<N>, number>

export type Vec2 = Vec<2>
export type Vec3 = Vec<3>
export type Vec4 = Vec<4>

export type VecN<T extends number> = T extends 1
  ? number
  : T extends 2
    ? Vec2
    : T extends 3
      ? Vec3
      : T extends 4
        ? Vec4
        : never
