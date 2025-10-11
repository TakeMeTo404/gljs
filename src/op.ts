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

export const normalize = ((v: number | BaseVector) => {
  if (typeof v === 'number') {
    return v / Math.abs(v)
  }

  const l = length(v as any)

  const newApi: VectorApi = {
    n: v._api.n,
  }

  for (let i = 0; i < v._api.n; i++) {
    newApi[i] = v._api[i] / l
  }

  return createVec(newApi)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>) => _<V>

const createUnaryOperator = (f: (x: number) => number) => {
  return ((x: number | BaseVector): number | BaseVector => {
    if (typeof x === 'number') {
      return f(x)
    }

    const newApi: VectorApi = {
      n: x._api.n,
    }

    for (let i = 0; i < x._api.n; i++) {
      newApi[i] = f(x[i])
    }

    return createVec(newApi)
  }) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>) => _<V>
}

export const exp = createUnaryOperator(Math.exp)
export const sqrt = createUnaryOperator(Math.sqrt)
export const log = createUnaryOperator(Math.log)
export const exp2 = createUnaryOperator((a) => 2 ** a)
export const log2 = createUnaryOperator(Math.log2)
export const abs = createUnaryOperator(Math.abs)
export const sign = createUnaryOperator(Math.sign)
export const floor = createUnaryOperator(Math.floor)
export const ceil = createUnaryOperator(Math.ceil)
export const fract = createUnaryOperator((x) => x - Math.floor(x))
export const trunc = createUnaryOperator(Math.trunc)

export const sin = createUnaryOperator(Math.sin)
export const cos = createUnaryOperator(Math.cos)
export const tan = createUnaryOperator(Math.tan)
export const asin = createUnaryOperator(Math.asin)
export const acos = createUnaryOperator(Math.acos)
export const atan = createUnaryOperator(Math.atan)
export const sinh = createUnaryOperator(Math.sinh)
export const cosh = createUnaryOperator(Math.cosh)
export const tanh = createUnaryOperator(Math.tanh)
export const asinh = createUnaryOperator(Math.asinh)
export const acosh = createUnaryOperator(Math.acosh)
export const atanh = createUnaryOperator(Math.atanh)

export const degrees = createUnaryOperator((radians) => (radians * 180) / Math.PI)
export const radians = createUnaryOperator((degrees) => (degrees * Math.PI) / 180)

const createBinaryOperator = (f: (a: number, b: number) => number) => {
  return ((a: number | BaseVector, b: number | BaseVector) => {
    if (typeof a === 'number') {
      return f(a, b as number)
    }

    const newApi: VectorApi = {
      n: a._api.n,
    }

    for (let i = 0; i < newApi.n; i++) {
      newApi[i] = f(a[i], typeof b === 'number' ? b : b[i])
    }

    return createVec(newApi)
  }) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>, y: number | NoInfer<V>) => _<V>
}

export const pow = createBinaryOperator((a, b) => Math.pow(a, b))
export const min = createBinaryOperator((a, b) => Math.min(a, b))
export const max = createBinaryOperator((a, b) => Math.max(a, b))
export const mod = createBinaryOperator((a, b) => a % b)

export const step = createBinaryOperator((egde, x) => (x < egde ? 0 : 1))

const createTernaryOperator = (f: (a: number, b: number, c: number) => number) => {
  return ((a: number | BaseVector, b: number | BaseVector, c: number | BaseVector) => {
    if (typeof a === 'number') {
      return f(a, b as number, c as number)
    }

    const newApi: VectorApi = {
      n: a._api.n,
    }

    for (let i = 0; i < newApi.n; i++) {
      newApi[i] = f(a[i], typeof b === 'number' ? b : b[i], typeof c === 'number' ? c : c[i])
    }

    return createVec(newApi)
  }) as <V extends number | Vec2 | Vec3 | Vec4>(
    a: _<V>,
    b: number | NoInfer<V>,
    c: number | NoInfer<V>,
  ) => _<V>
}

const _clamp = (x: number, min: number, max: number) => (x < min ? min : x > max ? max : x)
export const clamp = createTernaryOperator(_clamp)
export const mix = createTernaryOperator((x, y, a) => x * (1 - a) + y * a)
export const smoothstep = createTernaryOperator((edge0, edge1, x) => {
  const t = _clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
  return t * t * (3.0 - 2.0 * t)
})
