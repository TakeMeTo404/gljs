import { BaseMatrix, createMat, isMatrix, MatrixApi } from './mat'
import {
  Mat2,
  Mat2x3,
  Mat2x4,
  Mat3,
  Mat3x2,
  Mat3x4,
  Mat4,
  Mat4x2,
  Mat4x3,
  MatRxC,
} from './types/mat'
import { Vec2, Vec3, Vec4 } from './types/vec'
import { BaseVector, createVec, isVector, VectorApi } from './vec'

type _<T extends number | Vec2 | Vec3 | Vec4> = T extends number ? number : T

type VecSize<V extends Vec2 | Vec3 | Vec4> = V extends Vec2
  ? 2
  : V extends Vec3
    ? 3
    : V extends Vec4
      ? 4
      : never

type RowsCount<M extends Mat2 | Mat2x3 | Mat2x4 | Mat3x2 | Mat3 | Mat3x4 | Mat4x2 | Mat4x3 | Mat4> =
  M extends Mat2 | Mat2x3 | Mat2x4
    ? 2
    : M extends Mat3 | Mat3x2 | Mat3x4
      ? 3
      : M extends Mat4 | Mat4x2 | Mat4x3
        ? 4
        : never

type ColumnsCount<
  M extends Mat2 | Mat2x3 | Mat2x4 | Mat3x2 | Mat3 | Mat3x4 | Mat4x2 | Mat4x3 | Mat4,
> = M extends Mat2 | Mat3x2 | Mat4x2
  ? 2
  : M extends Mat3 | Mat2x3 | Mat4x3
    ? 3
    : M extends Mat2x4 | Mat3x4 | Mat4
      ? 4
      : never

const throwInvalid = (nameof: string) => {
  throw new Error(`Invalid '${nameof}' operator args`)
}

const createUnaryOperator = (f: (x: number) => number, nameof: string) => {
  return ((x: number | BaseVector): number | BaseVector => {
    if (typeof x === 'number') {
      return f(x)
    }

    if (!isVector(x)) {
      throwInvalid(nameof)
    }

    const newApi: VectorApi = {
      n: x._api.n,
    }

    for (let i = 0; i < x._api.n; i++) {
      newApi[i] = f(x[i])
    }

    return createVec(newApi)
  }) as <V extends number | Vec2 | Vec3 | Vec4>(x: V) => _<V>
}

export const exp = createUnaryOperator(Math.exp, 'exp')
export const sqrt = createUnaryOperator(Math.sqrt, 'sqrt')
export const inversesqrt = createUnaryOperator((x) => 1 / Math.sqrt(x), 'inversesqrt')
export const log = createUnaryOperator(Math.log, 'log')
export const exp2 = createUnaryOperator((a) => 2 ** a, 'exp2')
export const log2 = createUnaryOperator(Math.log2, 'log2')
export const abs = createUnaryOperator(Math.abs, 'abs')
export const sign = createUnaryOperator(Math.sign, 'sign')
export const floor = createUnaryOperator(Math.floor, 'floor')
export const ceil = createUnaryOperator(Math.ceil, 'ceil')
export const round = createUnaryOperator(Math.round, 'round')
export const fract = createUnaryOperator((x) => x - Math.floor(x), 'fract')
export const trunc = createUnaryOperator(Math.trunc, 'trunc')

export const sin = createUnaryOperator(Math.sin, 'sin')
export const cos = createUnaryOperator(Math.cos, 'cos')
export const tan = createUnaryOperator(Math.tan, 'tan')
export const asin = createUnaryOperator(Math.asin, 'asin')
export const acos = createUnaryOperator(Math.acos, 'acos')
export const atan = createUnaryOperator(Math.atan, 'atan')
export const sinh = createUnaryOperator(Math.sinh, 'sinh')
export const cosh = createUnaryOperator(Math.cosh, 'cosh')
export const tanh = createUnaryOperator(Math.tanh, 'tanh')
export const asinh = createUnaryOperator(Math.asinh, 'asinh')
export const acosh = createUnaryOperator(Math.acosh, 'acosh')
export const atanh = createUnaryOperator(Math.atanh, 'atanh')

export const degrees = createUnaryOperator((radians) => (radians * 180) / Math.PI, 'degrees')
export const radians = createUnaryOperator((degrees) => (degrees * Math.PI) / 180, 'radians')

const createBinaryOperator = (f: (a: number, b: number) => number, nameof: string) => {
  return ((a: number | BaseVector, b: number | BaseVector) => {
    ;(function validate() {
      if (typeof a === 'number') {
        if (typeof b === 'number') {
          return
        }
        throwInvalid(nameof)
      }

      if (isVector(a)) {
        if (typeof b === 'number') {
          return
        }
        if (isVector(b) && b._api.n === a._api.n) {
          return
        }
      }

      throwInvalid(nameof)
    })()

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
  }) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: number | NoInfer<_<V>>) => _<V>
}

export const pow = createBinaryOperator((a, b) => Math.pow(a, b), 'pow')
export const min = createBinaryOperator((a, b) => Math.min(a, b), 'min')
export const max = createBinaryOperator((a, b) => Math.max(a, b), 'max')
export const mod = createBinaryOperator((a, b) => a % b, 'mod')

export const step = createBinaryOperator((egde, x) => (x < egde ? 0 : 1), 'step')

const createTernaryOperator = (f: (a: number, b: number, c: number) => number, nameof: string) => {
  return ((a: number | BaseVector, b: number | BaseVector, c: number | BaseVector) => {
    ;(function validate() {
      if (typeof a === 'number') {
        if (typeof b === 'number' && typeof c === 'number') {
          return
        }
        throwInvalid(nameof)
      }

      if (isVector(a)) {
        if (typeof b === 'number' || (isVector(b) && b._api.n === a._api.n)) {
          if (typeof c === 'number' || (isVector(c) && c._api.n === a._api.n)) {
            return
          }
        }
      }

      throwInvalid(nameof)
    })()

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
    a: V,
    b: number | NoInfer<_<V>>,
    c: number | NoInfer<_<V>>,
  ) => _<V>
}

const _clamp = (x: number, min: number, max: number) => (x < min ? min : x > max ? max : x)
export const clamp = createTernaryOperator(_clamp, 'clamp')
export const mix = createTernaryOperator((x, y, a) => x * (1 - a) + y * a, 'mix')
export const smoothstep = createTernaryOperator((edge0, edge1, x) => {
  const t = _clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
  return t * t * (3.0 - 2.0 * t)
}, 'smoothstep')

export const length = ((v: number | BaseVector) => {
  if (typeof v !== 'number' && !isVector(v)) {
    throwInvalid('length')
  }

  if (typeof v === 'number') {
    return v
  }

  let sum = 0
  for (let i = 0; i < v._api.n; i++) {
    sum += v._api[i] * v._api[i]
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>) => number

const validateEqualSize = (x: number | BaseVector, y: number | BaseVector, nameof: string) => {
  if (typeof x === 'number' && typeof y === 'number') return
  if (isVector(x) && isVector(y) && x._api.n === y._api.n) return

  throwInvalid(nameof)
}

export const distance = ((x: number | BaseVector, y: number | BaseVector) => {
  validateEqualSize(x, y, 'distance')

  if (typeof x === 'number') {
    return Math.abs((y as number) - x)
  }

  let sum = 0
  for (let i = 0; i < x._api.n; i++) {
    sum += (x._api[i] - (y as BaseVector)._api[i]) * (x._api[i] - (y as BaseVector)._api[i])
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: NoInfer<_<V>>) => number

const _dot = (x: number | BaseVector, y: number | BaseVector) => {
  if (typeof x === 'number') {
    return x * (y as number)
  }

  let sum = 0
  for (let i = 0; i < x._api.n; i++) {
    sum += x._api[i] * (y as BaseVector)._api[i]
  }

  return sum
}

export const dot = ((x: number | BaseVector, y: number | BaseVector) => {
  validateEqualSize(x, y, 'dot')

  return _dot(x, y)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: NoInfer<_<V>>) => number

export const cross = (a: Vec3, b: Vec3): Vec3 => {
  if (!isVector(a) || !isVector(b) || a._api.n !== 3 || b._api.n !== 3) {
    throwInvalid('cross')
  }

  const api: VectorApi = {
    n: 3,
  }

  ;(api[0] = a[1] * b[2] - a[2] * b[1]),
    (api[1] = a[2] * b[0] - a[0] * b[2]),
    (api[2] = a[0] * b[1] - a[1] * b[0])

  return createVec(api) as unknown as Vec3
}

export const normalize = ((v: number | BaseVector) => {
  if (typeof v !== 'number' && !isVector(v)) {
    throwInvalid('normalize')
  }

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
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: V) => _<V>

export const faceforward = ((
  N: number | BaseVector,
  I: number | BaseVector,
  Nref: number | BaseVector,
) => {
  ;(function validate() {
    if (typeof N === 'number' && typeof I === 'number' && typeof Nref === 'number') {
      return
    }

    if (
      isVector(N) &&
      isVector(I) &&
      isVector(Nref) &&
      I._api.n === N._api.n &&
      Nref._api.n === N._api.n
    ) {
      return
    }

    throwInvalid('faceforward')
  })()

  if (_dot(I, Nref) < 0) {
    return N
  } else {
    if (typeof N === 'number') {
      return -N
    }

    const newApi: VectorApi = {
      n: N._api.n,
    }

    for (let i = 0; i < newApi.n; i++) {
      newApi[i] = -N._api[i]
    }

    return createVec(newApi)
  }
}) as <V extends number | Vec2 | Vec3 | Vec4>(N: V, I: NoInfer<_<V>>, Nref: NoInfer<_<V>>) => _<V>

export const reflect = ((I: number | BaseVector, N: number | BaseVector) => {
  validateEqualSize(I, N, 'reflect')

  if (typeof I === 'number') {
    return I - 2 * (N as number) * I * (N as number)
  }

  const d = _dot(I as any, N as any)

  const newApi: VectorApi = {
    n: I._api.n,
  }

  for (let i = 0; i < newApi.n; i++) {
    newApi[i] = I[i] - 2 * d * (N as BaseVector)[i]
  }

  return createVec(newApi)
}) as <V extends number | Vec2 | Vec3 | Vec4>(I: V, N: NoInfer<_<V>>) => _<V>

export const refract = ((I: number | BaseVector, N: number | BaseVector, eta: number) => {
  validateEqualSize(I, N, 'refract')
  if (typeof eta !== 'number') throwInvalid('refract')

  const d = _dot(I as any, N as any)
  const k: number = 1 - eta * eta * (1 - d * d)

  if (k < 0) {
    if (typeof I === 'number') {
      return 0
    } else {
      const newApi: VectorApi = {
        n: I._api.n,
      }

      for (let i = 0; i < newApi.n; i++) {
        newApi[i] = 0
      }

      return createVec(newApi)
    }
  } else {
    if (typeof I === 'number') {
      return eta * I - (eta * d + Math.sqrt(k)) * (N as number)
    } else {
      const newApi: VectorApi = {
        n: I._api.n,
      }

      for (let i = 0; i < newApi.n; i++) {
        newApi[i] = eta * I[i] - (eta * d + Math.sqrt(k)) * (N as BaseVector)[i]
      }

      return createVec(newApi)
    }
  }
}) as <V extends number | Vec2 | Vec3 | Vec4>(I: V, N: NoInfer<_<V>>, eta: number) => _<V>

export const outerProduct = ((a: BaseVector, b: BaseVector): BaseMatrix => {
  if (!isVector(a) || !isVector(b)) {
    throwInvalid('outerProduct')
  }

  const api: MatrixApi = {
    r: a._api.n,
    c: b._api.n,
  }

  for (let i = 0; i < api.r; i++) {
    api[i] = {}

    for (let j = 0; j < api.c; j++) {
      api[i][j] = a[i] * b[j]
    }
  }

  return createMat(api)
}) as unknown as <A extends Vec2 | Vec3 | Vec4, B extends Vec2 | Vec3 | Vec4>(
  a: A,
  b: B,
) => MatRxC<VecSize<A>, VecSize<B>>

export const transpose = ((mat: BaseMatrix): BaseMatrix => {
  if (!isMatrix(mat)) {
    throwInvalid('transpose')
  }

  const api: MatrixApi = {
    r: mat._api.c,
    c: mat._api.r,
  }

  for (let i = 0; i < api.r; i++) {
    api[i] = {}

    for (let j = 0; j < api.c; j++) {
      api[i][j] = mat._api[j][i]
    }
  }

  return createMat(api)
}) as unknown as <
  M extends Mat2 | Mat2x3 | Mat2x4 | Mat3x2 | Mat3 | Mat3x4 | Mat4x2 | Mat4x3 | Mat4,
>(
  mat: M,
) => MatRxC<ColumnsCount<M>, RowsCount<M>>

export const matrixCompMult = ((x: BaseMatrix, y: BaseMatrix) => {
  if (!isMatrix(x) || !isMatrix(y) || x._api.r !== y._api.r || x._api.c !== y._api.c) {
    throwInvalid('matrixCompMult')
  }

  const api: MatrixApi = {
    r: x._api.r,
    c: x._api.c,
  }

  for (let i = 0; i < api.r; i++) {
    api[i] = {}

    for (let j = 0; j < api.c; j++) {
      api[i][j] = x[i][j] * y[i][j]
    }
  }

  return createMat(api)
}) as unknown as <
  M extends Mat2 | Mat2x3 | Mat2x4 | Mat3x2 | Mat3 | Mat3x4 | Mat4x2 | Mat4x3 | Mat4,
>(
  x: M,
  y: NoInfer<M>,
) => M

const _getMinor = (api: MatrixApi, row: number, column: number): MatrixApi => {
  const minorApi: MatrixApi = {
    r: api.r - 1,
    c: api.c - 1,
  }

  for (let i = 0; i < api.r; i++) {
    if (i === row) continue

    const newRow: Record<number, number> = {}

    for (let j = 0; j < api.r; j++) {
      if (j === column) continue

      if (j < column) {
        newRow[j] = api[i][j]
      } else {
        newRow[j - 1] = api[i][j]
      }
    }

    if (i < row) {
      minorApi[i] = newRow
    } else {
      minorApi[i - 1] = newRow
    }
  }

  return minorApi
}

const _det3 = (api: MatrixApi) => {
  return (
    api[0][0] * api[1][1] * api[2][2] +
    api[0][1] * api[1][2] * api[2][0] +
    api[0][2] * api[1][0] * api[2][1] -
    api[0][2] * api[1][1] * api[2][0] -
    api[0][1] * api[1][0] * api[2][2] -
    api[0][0] * api[1][2] * api[2][1]
  )
}

const _determinant = (api: MatrixApi): number => {
  if (api.r === 2) {
    return api[0][0] * api[1][1] - api[0][1] * api[1][0]
  } else if (api.r === 3) {
    return _det3(api)
  } else {
    let det = 0
    for (let j = 0; j < 4; j++) {
      const sign = j % 2 === 0 ? 1 : -1
      det += sign * api[0][j] * _det3(_getMinor(api, 0, j))
    }
    return det
  }
}

export const determinant = ((mat: BaseMatrix): number => {
  if (!isMatrix(mat)) {
    throwInvalid('determinant')
  }

  if (mat._api.r !== mat._api.c) {
    throw new Error(`Determinant can only be calculated for square matrices`)
  }

  return _determinant(mat._api)
}) as unknown as <M extends Mat2 | Mat3 | Mat4>(mat: M) => number

export const inverse = ((mat: BaseMatrix): BaseMatrix => {
  if (!isMatrix(mat)) {
    throwInvalid('inverse')
  }

  if (mat._api.r !== mat._api.c) {
    throw new Error(`Inverse matrix can only be calculated for square matrices`)
  }

  const det = _determinant(mat._api)

  if (det === 0) {
    throw new Error('Matrix is singular (determinant is 0), inverse does not exist')
  }

  if (mat._api.r === 2) {
    const newApi: MatrixApi = {
      r: 2,
      c: 2,
      0: {
        0: mat._api[1][1] / det,
        1: -mat._api[0][1] / det,
      },
      1: {
        0: -mat._api[1][0] / det,
        1: mat._api[0][0] / det,
      },
    }

    return createMat(newApi)
  }

  const invApi: MatrixApi = {
    r: mat._api.r,
    c: mat._api.c,
  }

  for (let i = 0; i < invApi.r; i++) {
    invApi[i] = {}
  }

  for (let i = 0; i < invApi.r; i++) {
    for (let j = 0; j < invApi.c; j++) {
      invApi[j][i] = (Math.pow(-1, i + j) * _determinant(_getMinor(mat._api, i, j))) / det
    }
  }

  return createMat(invApi)
}) as unknown as <M extends Mat2 | Mat3 | Mat4>(mat: M) => M
