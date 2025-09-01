import { MatMxN, Mat, Mat3, Mat2, Mat3x2, Mat2x3 } from '../mat'
import { ArrayOfLength } from '../utils/ts-array'
import { Sum } from '../utils/ts-number'
import type { Vec2, Vec3, Vec4 } from '../vec'

type _<T extends number | Vec2 | Vec3 | Vec4> = T extends number ? number : T

type VecSize<V extends Vec2 | Vec3 | Vec4> = V extends Vec2
  ? 2
  : V extends Vec3
    ? 3
    : V extends Vec4
      ? 4
      : never

type GenMatrixType = Mat2 | Mat3 | Mat2x3 | Mat3x2

export const radians = <V extends number | Vec2 | Vec3 | Vec4>(degrees: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const degrees = <V extends number | Vec2 | Vec3 | Vec4>(radians: _<V>): _<V> => {
  throw new Error('not implemented')
}

export const sin = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const cos = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const tan = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const asin = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const acos = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const atan = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const sinh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const cosh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const tanh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const asinh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const acosh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const atanh = <V extends number | Vec2 | Vec3 | Vec4>(angle: _<V>): _<V> => {
  throw new Error('not implemented')
}

export const pow = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: number | NoInfer<V>,
): _<V> => {
  throw new Error('not implemented')
}
export const exp = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const log = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const sqrt = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}

export const abs = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const sign = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const floor = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const ceil = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const trunc = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const fract = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}
export const mod = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: number | NoInfer<V>,
): _<V> => {
  throw new Error('not implemented')
}
export const min = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: number | NoInfer<V>,
): _<V> => {
  throw new Error('not implemented')
}
export const max = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: number | NoInfer<V>,
): _<V> => {
  throw new Error('not implemented')
}
export const clamp = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  min: number | NoInfer<_<V>>,
  max: number | NoInfer<_<V>>,
): V => {
  throw new Error('not implemented')
}
export const mix = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: NoInfer<_<V>>,
  t: number | NoInfer<_<V>>,
): V => {
  throw new Error('not implemented')
}
export const step = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: number | NoInfer<V>,
): _<V> => {
  throw new Error('not implemented')
}
export const smoothstep = <V extends number | Vec2 | Vec3 | Vec4>(
  edge0: number | NoInfer<_<V>>,
  edge1: number | NoInfer<_<V>>,
  x: _<V>,
): V => {
  throw new Error('not implemented')
}

export const length = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): number => {
  throw new Error('not implemented')
}
export const distance = <V extends number | Vec2 | Vec3 | Vec4>(
  x: _<V>,
  y: NoInfer<_<V>>,
): number => {
  throw new Error('not implemented')
}
export const dot = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>, y: NoInfer<_<V>>): number => {
  throw new Error('not implemented')
}
export const cross = (x: Vec3, y: Vec3): number => {
  throw new Error('not implemented')
}
export const normalize = <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>): _<V> => {
  throw new Error('not implemented')
}

export const outerProduct = <V1 extends Vec2 | Vec3 | Vec4, V2 extends Vec2 | Vec3 | Vec4>(
  v1: V1,
  v2: V2,
): MatMxN<VecSize<V1>, VecSize<V2>> => {
  throw new Error('not implemented')
}
