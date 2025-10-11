import { Vec2, Vec3, Vec4 } from './types/vec'
import { BaseVector, createVec, VectorApi } from './vec'

type _<T extends number | Vec2 | Vec3 | Vec4> = T extends number ? number : T

export const length = ((v: number | BaseVector) => {
  if (typeof v === 'number') {
    return v
  }

  let sum = 0
  for (let i = 0; i < v._api.n; i++) {
    sum += v._api[i] * v._api[i]
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>) => number

export const distance = ((x: number | BaseVector, y: number | BaseVector) => {
  if (typeof x === 'number') {
    return Math.abs((y as number) - x)
  }

  let sum = 0
  for (let i = 0; i < x._api.n; i++) {
    sum += (x._api[i] - (y as BaseVector)._api[i]) * (x._api[i] - (y as BaseVector)._api[i])
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>, y: NoInfer<_<V>>) => number

export const dot = ((x: number | BaseVector, y: number | BaseVector) => {
  if (typeof x === 'number') {
    return x * (y as number)
  }

  let sum = 0
  for (let i = 0; i < x._api.n; i++) {
    sum += x._api[i] * (y as BaseVector)._api[i]
  }

  return sum
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>, y: NoInfer<_<V>>) => number

export const cross = (a: Vec3, b: Vec3): Vec3 => {
  const api: VectorApi = {
    n: 3,
  }

  ;(api[0] = a[1] * b[2] - a[2] * b[1]),
    (api[1] = a[2] * b[0] - a[0] * b[2]),
    (api[2] = a[0] * b[1] - a[1] * b[0])

  return createVec(api) as unknown as Vec3
}
