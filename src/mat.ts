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
import { BaseVector, createVec } from './vec'

type Api1D = {
  n: number
} & Record<number, number>

type Api2D = {
  n: number
} & Record<number, Api1D>

const parseArgs = (rowCount: number, columnCount: number, args: any[]) => {
  const rowsApi: Api2D = {
    n: rowCount,
  }

  for (let i = 0; i < rowCount; i++) {
    rowsApi[i] = {
      n: columnCount,
    }
    for (let j = 0; j < columnCount; j++) {
      rowsApi[i][j] = 0
    }
  }

  if (args.length === 1 && typeof args[0] === 'number') {
    const min = Math.min(rowCount, columnCount)
    for (let i = 0; i < min; i++) {
      rowsApi[i][i] = args[0]
    }
  } else {
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        // args[i] is arr or vec. Anyway, indexible via 0, 1, ..., c-1
        rowsApi[i][j] = args[i][j]
      }
    }
  }

  return rowsApi
}

type BaseMatrix = {
  copy: () => BaseMatrix

  columns: Record<number, BaseVector>
} & Record<number, BaseVector>

const createMat = (rowsApi: Api2D) => {
  const mat: BaseMatrix = ((
    op: string,
    other: number | BaseVector | BaseMatrix,
  ) => {}) as any as BaseMatrix

  mat.copy = () => {
    const newApi: Api2D = { n: rowsApi.n }
    for (let i = 0; i < rowsApi.n; i++) {
      newApi[i] = {
        n: rowsApi[i].n,
      }
      for (let j = 0; j < rowsApi[i].n; j++) {
        newApi[i][j] = rowsApi[i][j]
      }
    }

    return createMat(newApi)
  }

  for (let i = 0; i < rowsApi.n; i++) {
    const _i = i
    Object.defineProperty(mat, _i, {
      get(): BaseVector {
        const rowApi: Api1D = {
          n: rowsApi[_i].n,
        }
        for (let j = 0; j < rowsApi[_i].n; j++) {
          const _j = j
          Object.defineProperty(rowApi, _j, {
            get(): number {
              return rowsApi[_i][_j]
            },
            set(v: number) {
              rowsApi[_i][_j] = v
            },
          })
        }

        return createVec(rowApi)
      },
      set(v: BaseVector) {
        for (let j = 0; j < rowsApi[_i].n; j++) {
          rowsApi[_i][j] = v[j]
        }
      },
    })
  }

  return mat
}

const mat =
  (rowCount: number, columnCount: number) =>
  (...args: any[]) => {
    const rowsApi = parseArgs(rowCount, columnCount, args)

    return createMat(rowsApi)
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
