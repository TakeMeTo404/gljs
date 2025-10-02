const parseValues =
  (r, c) =>
  (...args) => {
    const values = new Array(r)
    for (let i = 0; i < r; i++) {
      values[i] = new Array(c)
      for (let j = 0; j < c; j++) {
        values[i][j] = 0
      }
    }

    if (args.length === 1 && typeof args[0] === 'number') {
      const min = Math.min(r, c)
      for (let i = 0; i < min; i++) {
        values[i][i] = args[0]
      }
    } else if (args.length === r) {
      for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
          // args[i] is arr or vec. Anyway, indexible via 0, 1, ..., c-1
          values[i][j] = args[i][j]
        }
      }
    } else {
      throw new Error('unexpected matrix create args')
      // TODO: { rows: XXX } and { columns: YYY }
    }

    return values
  }

const callableMatrix = (values) => {
  return (op, other) => {
    // TODO

    if (op === '*') {

    }

  }
}

const defineIndexProperties = (mat) => {
  for (let i = 0; i < mat.values.length; i++) {
    Object.defineProperty(mat, i, {
      get() {

      },

      set(v) {

      }
    })
  }
}

const mat =
  (r, c) =>
  (...args) => {
    const values = parseValues(r, c)(...args)

    const v = callableMatrix(values)
    v.values = values

    defineIndexProperties(mat)
  }

export const mat2 = mat(2, 2)
export const mat3 = mat(3, 3)
export const mat4 = mat(4, 4)

export const mat2x3 = mat(2, 3)
export const mat3x2 = mat(3, 2)

export const mat2x4 = mat(2, 4)
export const mat4x2 = mat(4, 2)

export const mat3x4 = mat(3, 4)
export const mat4x3 = mat(4, 3)
