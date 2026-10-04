import { API_SYMBOL, isMatrix, operations } from './const'
import type { BaseMatrix } from './mat'
import type { Vec2, Vec3, Vec4, VecCreateArgs } from './types/vec'

const xyzwIndexMap: Record<string, number> = {
  x: 0,
  y: 1,
  z: 2,
  w: 3,
}

const rgbaIndexMap: Record<string, number> = {
  r: 0,
  g: 1,
  b: 2,
  a: 3,
}

const mergedIndexMap: Record<string, number> = {
  ...xyzwIndexMap,
  ...rgbaIndexMap,
}

// Plain list of components, used for parsing constructor args
export type VectorApi = {
  n: number
} & Record<number, number>

export const isVector = (v: unknown): v is BaseVector => {
  return Boolean(v) && typeof v === 'function' && typeof (v as any)[API_SYMBOL]?.n === 'number'
}

export const parseArgsToApi = (args: unknown[]): VectorApi | false => {
  const api: VectorApi = { n: 0 }

  for (const arg of args) {
    if (typeof arg === 'number') {
      api[api.n] = arg
      api.n++
    } else if (isVector(arg)) {
      for (let i = 0; i < arg[API_SYMBOL].n; i++) {
        api[api.n] = arg[i]
        api.n++
      }
    } else {
      return false
    }
  }

  return api
}

// Components are stored directly on the vector function as plain data properties (vec[0], vec[1], ...).
// Don't replace them with accessors (Object.defineProperty) for regular vectors: V8 then switches
// the object to slow dictionary elements, which makes the whole library ~10x slower
export type BaseVector = {
  [API_SYMBOL]: { n: number }

  get: (selection: string) => number | BaseVector
  set: (selection: string, other: number | BaseVector) => void

  copy: () => BaseVector
} & Record<number, number> &
  Iterable<number>

const isValidGetSelection = (selection: string, n: number) => {
  let metXYZW = false
  let metRGBA = false

  for (let i = 0; i < selection.length; i++) {
    if (selection[i] in mergedIndexMap) {
      if (selection[i] in xyzwIndexMap) {
        if (metRGBA) return false
        if (xyzwIndexMap[selection[i]] >= n) return false
        metXYZW = true
      } else {
        if (metXYZW) return false
        if (rgbaIndexMap[selection[i]] >= n) return false
        metRGBA = true
      }
    } else {
      return false
    }
  }
  return true
}

// Creates a zero vector. All methods access components via vec[i], so a vector
// can be turned into a view (e.g. matrix row) by redefining its index properties
export const createVec = (n: number): BaseVector => {
  const vec: BaseVector = ((op: string, other: number | BaseVector | BaseMatrix) => {
    ;(function validate() {
      if (typeof op !== 'string') {
        throw new TypeError(`Invalid Vec${n} operation type: ${typeof op}`)
      }

      if (!(op in operations) && !(op.length === 2 && op[1] === '=' && op[0] in operations)) {
        throw new Error(`Invalid Vec${n} operation '${op}'`)
      }

      if (typeof other === 'number' || (isVector(other) && other[API_SYMBOL].n === n)) {
        return
      }

      // vec * mat – vector is treated as a row vector, like in GLSL
      if (op === '*') {
        if (isMatrix(other) && other[API_SYMBOL].r === n) return
        throw new Error(
          `Invalid Vec${n} '*' operation arg. Must be number, Vec${n} or Mat with ${n} rows`,
        )
      }

      if (op === '*=') {
        if (isMatrix(other) && other[API_SYMBOL].r === n && other[API_SYMBOL].c === n) {
          return
        }
        throw new Error(`Invalid Vec${n} '*=' operation arg. Must be number, Vec${n} or Mat${n}`)
      }

      throw new Error(`Invalid Vec${n} '${op}' operation arg. Must be number or Vec${n}`)
    })()

    if (isMatrix(other)) {
      const matrixApi = other[API_SYMBOL]

      const result = createVec(matrixApi.c)

      for (let j = 0; j < matrixApi.c; j++) {
        let sum = 0

        for (let i = 0; i < matrixApi.r; i++) {
          sum += vec[i] * matrixApi[j][i]
        }

        result[j] = sum
      }

      if (op === '*=') {
        for (let i = 0; i < n; i++) {
          vec[i] = result[i]
        }
        return
      }

      return result
    }

    const isAssignOperation = !(op in operations)

    const f = isAssignOperation ? operations[op[0]] : operations[op]

    const target = isAssignOperation ? vec : createVec(n)

    if (typeof other === 'number') {
      for (let i = 0; i < n; i++) {
        target[i] = f(vec[i], other)
      }
    } else {
      for (let i = 0; i < n; i++) {
        target[i] = f(vec[i], (other as BaseVector)[i])
      }
    }

    if (!isAssignOperation) {
      return target
    }
  }) as any as BaseVector

  vec[API_SYMBOL] = { n }

  for (let i = 0; i < n; i++) {
    vec[i] = 0
  }

  vec[Symbol.iterator] = function* () {
    for (let i = 0; i < n; i++) {
      yield vec[i]
    }
  }

  vec.get = (selection) => {
    ;(function validateGetSelection() {
      if (typeof selection !== 'string') {
        throw new TypeError(`Invalid Vec${n}.get selection type: ${typeof selection}`)
      }

      if (selection.length === 0 || selection.length > 4 || !isValidGetSelection(selection, n)) {
        throw new Error(`Invalid Vec${n}.get selection '${selection}'`)
      }
    })()

    if (selection.length === 1) {
      return vec[mergedIndexMap[selection[0]]]
    }

    const result = createVec(selection.length)
    for (let i = 0; i < selection.length; i++) {
      result[i] = vec[mergedIndexMap[selection[i]]]
    }

    return result
  }

  vec.set = (selection, other) => {
    ;(function validateSetSelection() {
      if (typeof selection !== 'string') {
        throw new TypeError(`Invalid Vec${n}.set selection type: ${typeof selection}`)
      }

      if (
        selection.length === 0 ||
        selection.length > n ||
        !isValidGetSelection(selection, n) ||
        new Set(selection.split('')).size !== selection.length
      ) {
        throw new Error(`Invalid Vec${n}.set selection '${selection}'`)
      }

      if (selection.length === 1) {
        if (typeof other !== 'number') {
          throw new Error(`Invalid Vec${n}.set '${selection}' selection value. Must be number`)
        }
      } else {
        if (!isVector(other) || other[API_SYMBOL].n !== selection.length) {
          throw new Error(
            `Invalid Vec${n}.set '${selection}' selection value. Must be Vec${selection.length}`,
          )
        }
      }
    })()

    if (typeof other === 'number') {
      vec[mergedIndexMap[selection[0]]] = other
    } else {
      for (let i = 0; i < selection.length; i++) {
        vec[mergedIndexMap[selection[i]]] = other[i]
      }
    }
  }

  vec.copy = () => {
    const result = createVec(n)
    for (let i = 0; i < n; i++) {
      result[i] = vec[i]
    }
    return result
  }

  vec.toString = () => {
    let str = `vec${n}(`
    for (let i = 0; i < n; i++) str += `${vec[i]}, `
    return str.substring(0, str.length - 2) + ')'
  }

  return vec
}

const vec =
  (n: number) =>
  (...args: any[]) => {
    const result = createVec(n)

    if (args.length === 1 && typeof args[0] === 'number') {
      for (let i = 0; i < n; i++) {
        result[i] = args[0]
      }

      return result
    } else {
      const api = parseArgsToApi(args)

      if (!api || api.n !== n) {
        throw new Error(`Invalid Vec${n} create args`)
      }

      for (let i = 0; i < n; i++) {
        result[i] = api[i]
      }

      return result
    }
  }

export const vec2 = vec(2) as any as <Args extends (number | Vec2)[]>(
  ...args: VecCreateArgs<2, Args>
) => Vec2
export const vec3 = vec(3) as any as <Args extends (number | Vec2 | Vec3)[]>(
  ...args: VecCreateArgs<3, Args>
) => Vec3
export const vec4 = vec(4) as any as <Args extends (number | Vec2 | Vec3 | Vec4)[]>(
  ...args: VecCreateArgs<4, Args>
) => Vec4
