import { API_SYMBOL, isMatrix, operations } from './const'
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
import { BaseVector, createVec, isVector, parseArgsToApi } from './vec'

// Column-major storage like in GLSL: api[column] is a column vector, api[column][row] is an element.
// m[j] returns the stored column vector itself, so columns are fast and always "live"
export type MatrixApi = {
  c: number
  r: number
} & Record<number, BaseVector>

export const createZeroApi = (columnCount: number, rowCount: number): MatrixApi => {
  const api: MatrixApi = {
    c: columnCount,
    r: rowCount,
  }

  for (let j = 0; j < columnCount; j++) {
    api[j] = createVec(rowCount)
  }

  return api
}

// GLSL naming: matCxR – C columns, R rows
const nameofMat = (c: number, r: number) => {
  return c === r ? `Mat${c}` : `Mat${c}x${r}`
}

export type BaseMatrix = {
  [API_SYMBOL]: MatrixApi

  copy: () => BaseMatrix

  rows: Record<number, BaseVector>
} & Record<number, BaseVector>

export { isMatrix }

export const createMat = (matrixApi: MatrixApi) => {
  const nameof = nameofMat(matrixApi.c, matrixApi.r)

  const mat: BaseMatrix = ((op: string, other: number | BaseVector | BaseMatrix) => {
    ;(function validate() {
      if (typeof op !== 'string') {
        throw new TypeError(`Invalid ${nameof} operation type: ${typeof op}`)
      }

      if (op !== '+' && op !== '-' && op !== '/' && op !== '*') {
        throw new Error(`Invalid ${nameof} operation '${op}'`)
      }

      if (op === '*') {
        if (typeof other == 'number') return
        if (isVector(other) && other[API_SYMBOL].n === matrixApi.c) return
        if (isMatrix(other) && other[API_SYMBOL].r === matrixApi.c) return
        throw new Error(
          `Invalid ${nameof} '*' operation arg. Must be number, Vec${matrixApi.c} or Mat with ${matrixApi.c} rows`,
        )
      } else {
        if (typeof other == 'number') return
        if (
          isMatrix(other) &&
          other[API_SYMBOL].r === matrixApi.r &&
          other[API_SYMBOL].c === matrixApi.c
        )
          return
        throw new Error(`Invalid ${nameof} '${op}' operation arg. Must be number or ${nameof}`)
      }
    })()

    if (op === '+' || op === '-' || op === '/' || (op === '*' && typeof other === 'number')) {
      const getOtherAt: (j: number, i: number) => number =
        typeof other === 'number' ? () => other : (j, i) => (other as BaseMatrix)[API_SYMBOL][j][i]

      const api = createZeroApi(matrixApi.c, matrixApi.r)

      for (let j = 0; j < matrixApi.c; j++) {
        for (let i = 0; i < matrixApi.r; i++) {
          api[j][i] = operations[op](matrixApi[j][i], getOtherAt(j, i))
        }
      }

      return createMat(api)
    } else {
      if (isMatrix(other)) {
        const otherApi = other[API_SYMBOL]

        const api = createZeroApi(otherApi.c, matrixApi.r)

        for (let j = 0; j < api.c; j++) {
          for (let i = 0; i < api.r; i++) {
            let sum = 0

            for (let k = 0; k < matrixApi.c; k++) {
              sum += matrixApi[k][i] * otherApi[j][k]
            }

            api[j][i] = sum
          }
        }

        return createMat(api)
      } else if (isVector(other)) {
        const result = createVec(matrixApi.r)

        for (let i = 0; i < matrixApi.r; i++) {
          let sum = 0

          for (let k = 0; k < matrixApi.c; k++) {
            sum += matrixApi[k][i] * other[k]
          }

          result[i] = sum
        }

        return result
      }
    }
  }) as any as BaseMatrix

  mat[API_SYMBOL] = matrixApi

  // m[j] – column j, like in GLSL. Returns the stored column vector (no allocation)
  for (let j = 0; j < matrixApi.c; j++) {
    const _j = j
    Object.defineProperty(mat, _j, {
      get(): BaseVector {
        return matrixApi[_j]
      },
      set(v: BaseVector) {
        if (!isVector(v) || v[API_SYMBOL].n !== matrixApi.r) {
          throw new Error(`Invalid ${nameof} column value. Must be Vec${matrixApi.r}`)
        }
        for (let i = 0; i < matrixApi.r; i++) {
          matrixApi[_j][i] = v[i]
        }
      },
    })
  }

  // m.rows[i] – row i. Rows aren't stored, so a row is a vector whose components are
  // accessors to the matrix elements (slower than columns, but rows are rarely used)
  mat.rows = {}
  for (let i = 0; i < matrixApi.r; i++) {
    const _i = i
    Object.defineProperty(mat.rows, _i, {
      get(): BaseVector {
        const row = createVec(matrixApi.c)

        for (let j = 0; j < matrixApi.c; j++) {
          const _j = j
          Object.defineProperty(row, _j, {
            get(): number {
              return matrixApi[_j][_i]
            },
            set(v: number) {
              matrixApi[_j][_i] = v
            },
          })
        }

        return row
      },
      set(v: BaseVector) {
        if (!isVector(v) || v[API_SYMBOL].n !== matrixApi.c) {
          throw new Error(`Invalid ${nameof} row value. Must be Vec${matrixApi.c}`)
        }
        for (let j = 0; j < matrixApi.c; j++) {
          matrixApi[j][_i] = v[j]
        }
      },
    })
  }

  mat.copy = () => {
    const newApi = createZeroApi(matrixApi.c, matrixApi.r)
    for (let j = 0; j < matrixApi.c; j++) {
      for (let i = 0; i < matrixApi.r; i++) {
        newApi[j][i] = matrixApi[j][i]
      }
    }

    return createMat(newApi)
  }

  return mat
}

const mat =
  (columnCount: number, rowCount: number) =>
  (...args: any[]) => {
    // from number
    if (args.length === 1 && typeof args[0] === 'number') {
      const api = createZeroApi(columnCount, rowCount)

      // repeat scalar at diagonal elements
      for (let i = Math.min(columnCount, rowCount); i > 0; i--) {
        api[i - 1][i - 1] = args[0]
      }

      return createMat(api)
    }

    // from other matrix
    if (args.length === 1 && isMatrix(args[0])) {
      const api = createZeroApi(columnCount, rowCount)

      const other = args[0][API_SYMBOL]

      const minC = Math.min(api.c, other.c)
      const minR = Math.min(api.r, other.r)

      // make diagonal 1
      for (let i = Math.min(columnCount, rowCount); i > 0; i--) {
        api[i - 1][i - 1] = 1
      }

      // copy window from other matrix
      for (let j = 0; j < minC; j++) {
        for (let i = 0; i < minR; i++) {
          api[j][i] = other[j][i]
        }
      }

      return createMat(api)
    }

    // from single vector – diagonal
    if (
      args.length === 1 &&
      isVector(args[0]) &&
      args[0][API_SYMBOL].n === Math.min(columnCount, rowCount)
    ) {
      const api = createZeroApi(columnCount, rowCount)

      // repeat scalar at diagonal elements
      for (let i = Math.min(columnCount, rowCount); i > 0; i--) {
        api[i - 1][i - 1] = args[0][i - 1]
      }

      return createMat(api)
    }

    // from c*r components (numbers and vectors), column by column
    const argsVectorApi = parseArgsToApi(args)

    if (!argsVectorApi || argsVectorApi.n !== columnCount * rowCount) {
      throw new Error(`Invalid ${nameofMat(columnCount, rowCount)} create args`)
    }

    const api = createZeroApi(columnCount, rowCount)

    for (let j = 0; j < columnCount; j++) {
      for (let i = 0; i < rowCount; i++) {
        api[j][i] = argsVectorApi[j * rowCount + i]
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
