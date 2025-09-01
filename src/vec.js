import { operations, rgba, xyzw } from './const'

const createCallableVector = (values) => {
  return (op, other) => {
    // todo: assert args

    const isAssignOperation = !(op in operations)

    const f = isAssignOperation ? operations[op[0]] : operations[op]

    const otherAt = typeof other === 'number' ? () => other : (i) => other[i]

    if (isAssignOperation) {
      for (let i = 0; i < values.length; i++) {
        values[i] = f(values[i], otherAt(i))
      }
    } else {
      const newValues = new Array(values.length)
      for (let i = 0; i < values.length; i++) {
        newValues[i] = f(values[i], otherAt(i))
      }

      if (values.length === 2) {
        return vec2(...newValues)
      } else if (values.length === 3) {
        return vec3(...newValues)
      } else {
        return vec4(...newValues)
      }
    }
  }
}

const defineIndexProperties = (vec) => {
  for (let i = 0; i < vec.values.length; i++) {
    Object.defineProperty(vec, i, {
      get() {
        return vec.values[i]
      },

      set(v) {
        vec.values[i] = v
      },
    })
  }
}

const selectionIndexMap = {
  x: 0,
  y: 1,
  z: 2,
  w: 3,

  r: 0,
  g: 1,
  b: 2,
  a: 3,
}

const selectionToIndexes = (selection) => {
  const indexes = new Array(selection.length)

  for (let i = 0; i < indexes.length; i++) {
    indexes[i] = selectionIndexMap[selection[i]]
  }

  return indexes
}

const defineGet = (vec) => {
  vec.get = (selection) => {
    // todo: assert args
    const iArr = selectionToIndexes(selection)
    const vArr = iArr.map((i) => vec.values[i])

    switch (selection.length) {
      case 1:
        return vArr[0]
      case 2:
        return vec2(...vArr)
      case 3:
        return vec3(...vArr)
      case 4:
        return vec4(...vArr)
    }
  }
}

const defineSet = (vec) => {
  vec.set = (selection, other) => {
    // todo: assert args

    const iArr = selectionToIndexes(selection)

    const otherAt = typeof other === 'number' ? () => other : (i) => other[i]

    for (let i = 0; i < iArr.length; i++) {
      vec.values[iArr[i]] = otherAt(i)
    }
  }
}

const parseValues =
  (n) =>
  (...args) => {
    // todo: assert args

    const values = new Array(n)

    // repeat one scalar
    if (args.length === 1 && typeof args[0] === 'number') {
      for (let i = 0; i < n; i++) values[i] = args[0]
      return values
    }

    // given N args – N scalars
    if (args.length === n) {
      for (let i = 0; i < n; i++) values[i] = args[i]
      return values
    }

    // given 1 arg – array of N scalars
    if (Array.isArray(args[0])) {
      for (let i = 0; i < n; i++) values[i] = args[0][i]
      return values
    }

    if (typeof args[0] === 'object' && 'x' in args[0]) {
      for (let i = 0; i < n; i++) values[i] = args[0][xyzw[i]]
      return values
    }
    if (typeof args[0] === 'object' && 'r' in args[0]) {
      for (let i = 0; i < n; i++) values[i] = args[0][rgba[i]]
      return values
    }

    if (n === 2) {
      // now we assume args = [Vec2]
      values[0] = args[0][0]
      values[1] = args[0][1]
    } else if (n === 3) {
      if (args.length === 1) {
        // args: [Vec3]
        values[0] = args[0][0]
        values[1] = args[0][1]
        values[2] = args[0][2]
      } else {
        if (typeof args[0] === 'number') {
          // args: [number, Vec2]
          values[0] = args[0]
          values[1] = args[1][0]
          values[2] = args[1][1]
        } else {
          // args: [Vec2, number]
          values[0] = args[0][0]
          values[1] = args[0][1]
          values[2] = args[1]
        }
      }
    } else {
      if (args.length === 1) {
        // args: [Vec4]
        values[0] = args[0][0]
        values[1] = args[0][1]
        values[2] = args[0][2]
        values[3] = args[0][3]
      } else if (args.length === 2) {
        if (typeof args[0] === 'number') {
          // args: [number, Vec3]
          values[0] = args[0]
          values[1] = args[1][0]
          values[2] = args[1][1]
          values[3] = args[1][2]
        } else {
          // args: [Vec3, number]
          values[0] = args[0][0]
          values[1] = args[0][1]
          values[2] = args[0][2]
          values[3] = args[1]
        }
      } else {
        if (typeof args[0] !== 'number') {
          // args: [Vec2, number, number]
          values[0] = args[0][0]
          values[1] = args[0][1]
          values[2] = args[1]
          values[3] = args[2]
        } else if (typeof args[1] !== 'number') {
          // args: [number, Vec2, number]
          values[0] = args[0]
          values[1] = args[1][0]
          values[2] = args[1][1]
          values[3] = args[2]
        } else {
          // args: [number, number, Vec2]
          values[0] = args[0]
          values[1] = args[1]
          values[2] = args[2][0]
          values[3] = args[2][1]
        }
      }
    }

    return values
  }

const vec =
  (n) =>
  (...args) => {
    const values = parseValues(n)(...args)

    const v = createCallableVector(values)
    v.values = values

    defineIndexProperties(v)

    defineGet(v)
    defineSet(v)

    return v
  }

export const vec2 = vec(2)
export const vec3 = vec(3)
export const vec4 = vec(4)
