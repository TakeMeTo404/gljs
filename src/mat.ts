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
import { BaseVector, createVec, VectorApi } from './vec'

type MatrixApi = {
  r: number
  c: number
} & Record<number, Record<number, number>>

const parseArgs = (rowCount: number, columnCount: number, args: any[]) => {
  const api2d: MatrixApi = {
    r: rowCount,
    c: columnCount,
  }

  for (let i = 0; i < rowCount; i++) {
    api2d[i] = {}
    for (let j = 0; j < columnCount; j++) {
      api2d[i][j] = 0
    }
  }

  if (args.length === 1 && typeof args[0] === 'number') {
    const min = Math.min(rowCount, columnCount)
    for (let i = 0; i < min; i++) {
      api2d[i][i] = args[0]
    }
  } else {
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        // args[i] is arr or vec. Anyway, indexible via 0, 1, ..., c-1
        api2d[i][j] = args[i][j]
      }
    }
  }

  return api2d
}

type BaseMatrix = {
  _api: MatrixApi

  copy: () => BaseMatrix

  columns: Record<number, BaseVector>
} & Record<number, BaseVector>

const createMat = (matrixApi: MatrixApi) => {
  const mat: BaseMatrix = ((
    op: string,
    other: number | BaseVector | BaseMatrix,
  ) => {}) as any as BaseMatrix

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
        for (let j = 0; j < matrixApi.r; j++) {
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
    const api2d = parseArgs(rowCount, columnCount, args)

    return createMat(api2d)
  }

export const mat2 = mat(2, 2) as any as (...args: MatCreateArgs<2, 2>) => Mat2
export const mat3 = mat(3, 3) as any as (...args: MatCreateArgs<3, 3>) => Mat3
export const mat4 = mat(4, 4) as any as (...args: MatCreateArgs<4, 4>) => Mat4

export const mat2x3 = mat(2, 3) as any as (...args: MatCreateArgs<2, 3>) => Mat2x3
export const mat3x2 = mat(3, 2) as any as (...args: MatCreateArgs<3, 2>) => Mat3x2

export const mat2x4 = mat(2, 4) as any as (...args: MatCreateArgs<2, 4>) => Mat2x4
export const mat4x2 = mat(4, 2) as any as (...args: MatCreateArgs<4, 2>) => Mat4x2

export const mat3x4 = mat(3, 4) as any as (...args: MatCreateArgs<3, 4>) => Mat3x4
export const mat4x3 = mat(4, 3) as any as (...args: MatCreateArgs<4, 3>) => Mat4x3
