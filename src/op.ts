import { API_SYMBOL } from './const'
import { BaseMatrix, createMat, createZeroApi, isMatrix } from './mat'
import { AnyMat, ColumnsCount, Mat2, Mat3, Mat4, MatCxR, RowsCount } from './types/mat'
import { Vec2, Vec3, Vec4 } from './types/vec'
import { BaseVector, createVec, isVector } from './vec'

type _<T extends number | Vec2 | Vec3 | Vec4> = T extends number ? number : T

type VecSize<V extends Vec2 | Vec3 | Vec4> = V extends Vec2
  ? 2
  : V extends Vec3
    ? 3
    : V extends Vec4
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

    const result = createVec(x[API_SYMBOL].n)

    for (let i = 0; i < x[API_SYMBOL].n; i++) {
      result[i] = f(x[i])
    }

    return result
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
        if (isVector(b) && b[API_SYMBOL].n === a[API_SYMBOL].n) {
          return
        }
      }

      throwInvalid(nameof)
    })()

    if (typeof a === 'number') {
      return f(a, b as number)
    }

    const result = createVec(a[API_SYMBOL].n)

    for (let i = 0; i < result[API_SYMBOL].n; i++) {
      result[i] = f(a[i], typeof b === 'number' ? b : b[i])
    }

    return result
  }) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: number | NoInfer<_<V>>) => _<V>
}

export const pow = createBinaryOperator((a, b) => Math.pow(a, b), 'pow')
export const min = createBinaryOperator((a, b) => Math.min(a, b), 'min')
export const max = createBinaryOperator((a, b) => Math.max(a, b), 'max')
export const mod = createBinaryOperator((a, b) => a - b * Math.floor(a / b), 'mod')

export const step = createBinaryOperator((edge, x) => (x < edge ? 0 : 1), 'step')

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
        if (typeof b === 'number' || (isVector(b) && b[API_SYMBOL].n === a[API_SYMBOL].n)) {
          if (typeof c === 'number' || (isVector(c) && c[API_SYMBOL].n === a[API_SYMBOL].n)) {
            return
          }
        }
      }

      throwInvalid(nameof)
    })()

    if (typeof a === 'number') {
      return f(a, b as number, c as number)
    }

    const result = createVec(a[API_SYMBOL].n)

    for (let i = 0; i < result[API_SYMBOL].n; i++) {
      result[i] = f(a[i], typeof b === 'number' ? b : b[i], typeof c === 'number' ? c : c[i])
    }

    return result
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
  for (let i = 0; i < v[API_SYMBOL].n; i++) {
    sum += v[i] * v[i]
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: _<V>) => number

const validateEqualSize = (x: number | BaseVector, y: number | BaseVector, nameof: string) => {
  if (typeof x === 'number' && typeof y === 'number') return
  if (isVector(x) && isVector(y) && x[API_SYMBOL].n === y[API_SYMBOL].n) return

  throwInvalid(nameof)
}

export const distance = ((x: number | BaseVector, y: number | BaseVector) => {
  validateEqualSize(x, y, 'distance')

  if (typeof x === 'number') {
    return Math.abs((y as number) - x)
  }

  let sum = 0
  for (let i = 0; i < x[API_SYMBOL].n; i++) {
    sum +=
      (x[i] - (y as BaseVector)[i]) * (x[i] - (y as BaseVector)[i])
  }

  return Math.sqrt(sum)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: NoInfer<_<V>>) => number

const _dot = (x: number | BaseVector, y: number | BaseVector) => {
  if (typeof x === 'number') {
    return x * (y as number)
  }

  let sum = 0
  for (let i = 0; i < x[API_SYMBOL].n; i++) {
    sum += x[i] * (y as BaseVector)[i]
  }

  return sum
}

export const dot = ((x: number | BaseVector, y: number | BaseVector) => {
  validateEqualSize(x, y, 'dot')

  return _dot(x, y)
}) as <V extends number | Vec2 | Vec3 | Vec4>(x: V, y: NoInfer<_<V>>) => number

export const cross = (a: Vec3, b: Vec3): Vec3 => {
  if (!isVector(a) || !isVector(b) || a[API_SYMBOL].n !== 3 || b[API_SYMBOL].n !== 3) {
    throwInvalid('cross')
  }

  const result = createVec(3)

  result[0] = a[1] * b[2] - a[2] * b[1]
  result[1] = a[2] * b[0] - a[0] * b[2]
  result[2] = a[0] * b[1] - a[1] * b[0]

  return result as unknown as Vec3
}

export const normalize = ((v: number | BaseVector) => {
  if (typeof v !== 'number' && !isVector(v)) {
    throwInvalid('normalize')
  }

  if (typeof v === 'number') {
    return v / Math.abs(v)
  }

  const l = length(v as any)

  const result = createVec(v[API_SYMBOL].n)

  for (let i = 0; i < v[API_SYMBOL].n; i++) {
    result[i] = v[i] / l
  }

  return result
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
      I[API_SYMBOL].n === N[API_SYMBOL].n &&
      Nref[API_SYMBOL].n === N[API_SYMBOL].n
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

    const result = createVec(N[API_SYMBOL].n)

    for (let i = 0; i < result[API_SYMBOL].n; i++) {
      result[i] = -N[i]
    }

    return result
  }
}) as <V extends number | Vec2 | Vec3 | Vec4>(N: V, I: NoInfer<_<V>>, Nref: NoInfer<_<V>>) => _<V>

export const reflect = ((I: number | BaseVector, N: number | BaseVector) => {
  validateEqualSize(I, N, 'reflect')

  if (typeof I === 'number') {
    return I - 2 * (N as number) * I * (N as number)
  }

  const d = _dot(I as any, N as any)

  const result = createVec(I[API_SYMBOL].n)

  for (let i = 0; i < result[API_SYMBOL].n; i++) {
    result[i] = I[i] - 2 * d * (N as BaseVector)[i]
  }

  return result
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
      // total internal reflection – zero vector
      return createVec(I[API_SYMBOL].n)
    }
  } else {
    if (typeof I === 'number') {
      return eta * I - (eta * d + Math.sqrt(k)) * (N as number)
    } else {
      const result = createVec(I[API_SYMBOL].n)

      for (let i = 0; i < result[API_SYMBOL].n; i++) {
        result[i] = eta * I[i] - (eta * d + Math.sqrt(k)) * (N as BaseVector)[i]
      }

      return result
    }
  }
}) as <V extends number | Vec2 | Vec3 | Vec4>(I: V, N: NoInfer<_<V>>, eta: number) => _<V>

// c is treated as a column vector, r as a row vector: result has r.n columns and c.n rows
export const outerProduct = ((c: BaseVector, r: BaseVector): BaseMatrix => {
  if (!isVector(c) || !isVector(r)) {
    throwInvalid('outerProduct')
  }

  const api = createZeroApi(r[API_SYMBOL].n, c[API_SYMBOL].n)

  for (let j = 0; j < api.c; j++) {
    for (let i = 0; i < api.r; i++) {
      api[j][i] = c[i] * r[j]
    }
  }

  return createMat(api)
}) as unknown as <C extends Vec2 | Vec3 | Vec4, R extends Vec2 | Vec3 | Vec4>(
  c: C,
  r: R,
) => MatCxR<VecSize<R>, VecSize<C>>

export const transpose = ((mat: BaseMatrix): BaseMatrix => {
  if (!isMatrix(mat)) {
    throwInvalid('transpose')
  }

  const api = createZeroApi(mat[API_SYMBOL].r, mat[API_SYMBOL].c)

  for (let j = 0; j < api.c; j++) {
    for (let i = 0; i < api.r; i++) {
      api[j][i] = mat[API_SYMBOL][i][j]
    }
  }

  return createMat(api)
}) as unknown as <M extends AnyMat>(mat: M) => MatCxR<RowsCount<M>, ColumnsCount<M>>

export const matrixCompMult = ((x: BaseMatrix, y: BaseMatrix) => {
  if (
    !isMatrix(x) ||
    !isMatrix(y) ||
    x[API_SYMBOL].r !== y[API_SYMBOL].r ||
    x[API_SYMBOL].c !== y[API_SYMBOL].c
  ) {
    throwInvalid('matrixCompMult')
  }

  const api = createZeroApi(x[API_SYMBOL].c, x[API_SYMBOL].r)

  for (let j = 0; j < api.c; j++) {
    for (let i = 0; i < api.r; i++) {
      api[j][i] = x[API_SYMBOL][j][i] * y[API_SYMBOL][j][i]
    }
  }

  return createMat(api)
}) as unknown as <M extends AnyMat>(x: M, y: NoInfer<M>) => M

// Plain square grid of numbers used by determinant/inverse internals
type Grid = { r: number; c: number } & Record<number, Record<number, number>>

const _getMinor = (api: Grid, row: number, column: number): Grid => {
  const minorApi: Grid = {
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

const _det3 = (api: Grid) => {
  return (
    api[0][0] * api[1][1] * api[2][2] +
    api[0][1] * api[1][2] * api[2][0] +
    api[0][2] * api[1][0] * api[2][1] -
    api[0][2] * api[1][1] * api[2][0] -
    api[0][1] * api[1][0] * api[2][2] -
    api[0][0] * api[1][2] * api[2][1]
  )
}

const _determinant = (api: Grid): number => {
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

  if (mat[API_SYMBOL].r !== mat[API_SYMBOL].c) {
    throw new Error(`Determinant can only be calculated for square matrices`)
  }

  return _determinant(mat[API_SYMBOL])
}) as unknown as <M extends Mat2 | Mat3 | Mat4>(mat: M) => number

export const inverse = ((mat: BaseMatrix): BaseMatrix => {
  if (!isMatrix(mat)) {
    throwInvalid('inverse')
  }

  if (mat[API_SYMBOL].r !== mat[API_SYMBOL].c) {
    throw new Error(`Inverse matrix can only be calculated for square matrices`)
  }

  const det = _determinant(mat[API_SYMBOL])

  if (det === 0) {
    throw new Error('Matrix is singular (determinant is 0), inverse does not exist')
  }

  if (mat[API_SYMBOL].r === 2) {
    const m = mat[API_SYMBOL]
    const newApi = createZeroApi(2, 2)

    newApi[0][0] = m[1][1] / det
    newApi[0][1] = -m[0][1] / det
    newApi[1][0] = -m[1][0] / det
    newApi[1][1] = m[0][0] / det

    return createMat(newApi)
  }

  const invApi = createZeroApi(mat[API_SYMBOL].c, mat[API_SYMBOL].r)

  for (let i = 0; i < invApi.r; i++) {
    for (let j = 0; j < invApi.c; j++) {
      invApi[j][i] = (Math.pow(-1, i + j) * _determinant(_getMinor(mat[API_SYMBOL], i, j))) / det
    }
  }

  return createMat(invApi)
}) as unknown as <M extends Mat2 | Mat3 | Mat4>(mat: M) => M
