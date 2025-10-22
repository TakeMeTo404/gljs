import { operations } from './const'
import type {
  Mat2,
  Mat3,
  Mat4,
  Mat2x3,
  Mat3x2,
  Mat2x4,
  Mat4x2,
  Mat3x4,
  Mat4x3,
  MatCreateArgs,
} from './types/mat'
import { Vec2, Vec3, Vec4 } from './types/vec'
import { BaseVector, createVec, isVector, parseArgsToApi, VectorApi } from './vec'

export type MatrixApi = {
  r: number
  c: number
} & Record<number, Record<number, number>>

const createZeroApi = (rowCount: number, columnCount: number): MatrixApi => {
  const api: MatrixApi = {
    r: rowCount,
    c: columnCount,
  }

  for (let i = 0; i < rowCount; i++) {
    api[i] = {}
    for (let j = 0; j < columnCount; j++) {
      api[i][j] = 0
    }
  }

  return api
}

export type BaseMatrix = {
  _api: MatrixApi

  copy: () => BaseMatrix

  columns: Record<number, BaseVector>
} & Record<number, BaseVector>

const isMatrix = (v: unknown): v is BaseMatrix => {
  return Boolean(v) && typeof v === 'function' && typeof (v as any)._api.r === 'number'
}

export const createMat = (matrixApi: MatrixApi) => {
  const mat: BaseMatrix = ((op: string, other: number | BaseVector | BaseMatrix) => {
    if (op === '+' || op === '-' || op === '/' || (op === '*' && typeof other === 'number')) {
      const getOtherAt: (i: number, j: number) => number =
        typeof other === 'number' ? () => other : (i, j) => (other as BaseMatrix)[i][j]

      const api: MatrixApi = {
        r: matrixApi.r,
        c: matrixApi.c,
      }

      for (let i = 0; i < matrixApi.r; i++) {
        api[i] = {}

        for (let j = 0; j < matrixApi.c; j++) {
          api[i][j] = operations[op](matrixApi[i][j], getOtherAt(i, j))
        }
      }

      return createMat(api)
    } else {
      if (isMatrix(other)) {
        const api: MatrixApi = {
          r: matrixApi.r,
          c: other._api.c,
        }

        for (let i = 0; i < api.r; i++) {
          api[i] = {}

          for (let j = 0; j < api.c; j++) {
            api[i][j] = 0

            for (let k = 0; k < matrixApi.c; k++) {
              api[i][j] += matrixApi[i][k] * other[k][j]
            }
          }
        }

        return createMat(api)
      } else if (isVector(other)) {
        const api: VectorApi = {
          n: matrixApi.r,
        }

        for (let i = 0; i < matrixApi.r; i++) {
          api[i] = 0

          for (let j = 0; j < matrixApi.c; j++) {
            api[i] += other[j] * matrixApi[i][j]
          }
        }

        return createVec(api)
      }
    }
  }) as any as BaseMatrix

  mat._api = matrixApi

  for (let i = 0; i < matrixApi.r; i++) {
    const _i = i
    Object.defineProperty(mat, _i, {
      get(): BaseVector {
        const rowApi: VectorApi = { n: matrixApi.c }

        for (let j = 0; j < matrixApi.c; j++) {
          const _j = j
          Object.defineProperty(rowApi, _j, {
            get(): number {
              return matrixApi[_i][_j]
            },
            set(v: number) {
              matrixApi[_i][_j] = v
            },
          })
        }

        return createVec(rowApi)
      },
      set(v: BaseVector) {
        for (let j = 0; j < matrixApi.c; j++) {
          matrixApi[_i][j] = v[j]
        }
      },
    })
  }

  mat.columns = {}
  for (let j = 0; j < matrixApi.c; j++) {
    const _j = j
    Object.defineProperty(mat.columns, _j, {
      get(): BaseVector {
        const columnApi: VectorApi = {
          n: matrixApi.r,
        }
        for (let i = 0; i < matrixApi.r; i++) {
          const _i = i
          Object.defineProperty(columnApi, _i, {
            get(): number {
              return matrixApi[_i][_j]
            },
            set(v: number) {
              matrixApi[_i][_j] = v
            },
          })
        }

        return createVec(columnApi)
      },
      set(v: BaseVector) {
        for (let i = 0; i < matrixApi.r; i++) {
          matrixApi[i][_j] = v[i]
        }
      },
    })
  }

  mat.copy = () => {
    const newApi: MatrixApi = { r: matrixApi.r, c: matrixApi.c }
    for (let i = 0; i < matrixApi.r; i++) {
      newApi[i] = {}
      for (let j = 0; j < matrixApi.c; j++) {
        newApi[i][j] = matrixApi[i][j]
      }
    }

    return createMat(newApi)
  }

  return mat
}

const mat =
  (rowCount: number, columnCount: number) =>
  (...args: any[]) => {
    // from number
    if (args.length === 1 && typeof args[0] === 'number') {
      const api = createZeroApi(rowCount, columnCount)

      // repeat scalar at diagonal elements
      for (let i = Math.min(rowCount, columnCount); i > 0; i--) {
        api[i - 1][i - 1] = args[0]
      }

      return createMat(api)
    }

    // from single vector – diagonal
    if (
      args.length === 1 &&
      isVector(args[0]) &&
      args[0]._api.n === Math.min(rowCount, columnCount)
    ) {
      const api = createZeroApi(rowCount, columnCount)

      // repeat scalar at diagonal elements
      for (let i = Math.min(rowCount, columnCount); i > 0; i--) {
        api[i - 1][i - 1] = args[0][i - 1]
      }

      return createMat(api)
    }

    // from other matrix
    if (args.length === 1 && isMatrix(args[0])) {
      const api = createZeroApi(rowCount, columnCount)

      const other = args[0]._api

      const minR = Math.min(api.r, other.r)
      const minC = Math.min(api.c, other.c)

      // make diagonal 1
      for (let i = Math.min(rowCount, columnCount); i > 0; i--) {
        api[i - 1][i - 1] = 1
      }

      // copy window from other matrix
      for (let i = 0; i < minR; i++) {
        for (let j = 0; j < minC; j++) {
          api[i][j] = other[i][j]
        }
      }

      return createMat(api)
    }

    // from r*c components (numbers and vectors)
    const argsVectorApi = parseArgsToApi(args)

    if (argsVectorApi.n !== rowCount * columnCount) {
      throw new Error('Invalid args')
    }

    const api: MatrixApi = {
      r: rowCount,
      c: columnCount,
    }

    for (let i = 0; i < rowCount; i++) {
      api[i] = {}
      for (let j = 0; j < columnCount; j++) {
        api[i][j] = argsVectorApi[i * columnCount + j]
      }
    }

    return createMat(api)
  }

export const mat2 = mat(2, 2) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<2, 2, Args>
) => Mat2
export const mat3 = mat(3, 3) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<3, 3, Args>
) => Mat3
export const mat4 = mat(4, 4) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<4, 4, Args>
) => Mat4

export const mat2x3 = mat(2, 3) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<2, 3, Args>
) => Mat2x3
export const mat3x2 = mat(3, 2) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<3, 2, Args>
) => Mat3x2

export const mat2x4 = mat(2, 4) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<2, 4, Args>
) => Mat2x4
export const mat4x2 = mat(4, 2) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<4, 2, Args>
) => Mat4x2

export const mat3x4 = mat(3, 4) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<3, 4, Args>
) => Mat3x4
export const mat4x3 = mat(4, 3) as any as <Args extends unknown[]>(
  ...args: MatCreateArgs<4, 3, Args>
) => Mat4x3
