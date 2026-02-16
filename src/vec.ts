import { API_SYMBOL, operations } from './const'
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

export type BaseVector = {
  [API_SYMBOL]: VectorApi

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

export const createVec = (api: VectorApi) => {
  const vec: BaseVector = ((op: string, other: number | BaseVector) => {
    ;(function validate() {
      if (typeof op !== 'string') {
        throw new TypeError(`Invalid Vec${api.n} operation type: ${typeof op}`)
      }

      if (!(op in operations) && !(op.length === 2 && op[1] === '=' && op[0] in operations)) {
        throw new Error(`Invalid Vec${api.n} operation '${op}'`)
      }

      if (typeof other === 'number' || (isVector(other) && other[API_SYMBOL].n === api.n)) {
        return
      }

      throw new Error(`Invalid Vec${api.n} '${op}' operation arg. Must be number or Vec${api.n}`)
    })()

    const isAssignOperation = !(op in operations)

    const f = isAssignOperation ? operations[op[0]] : operations[op]

    const otherAt = typeof other === 'number' ? () => other : (i: number) => other[i] as number

    if (isAssignOperation) {
      for (let i = 0; i < api.n; i++) {
        api[i] = f(api[i], otherAt(i))
      }
    } else {
      const newApi: VectorApi = {
        n: api.n,
      }

      for (let i = 0; i < api.n; i++) {
        newApi[i] = f(api[i], otherAt(i))
      }

      return createVec(newApi)
    }
  }) as any as BaseVector

  vec[API_SYMBOL] = api

  vec[Symbol.iterator] = function* () {
    for (let i = 0; i < api.n; i++) {
      yield api[i] as number
    }
  }

  // define index properties
  for (let i = 0; i < api.n; i++) {
    const _i = i
    Object.defineProperty(vec, _i, {
      get() {
        return api[_i]
      },

      set(v) {
        api[_i] = v
      },
    })
  }

  vec.get = (selection) => {
    ;(function validateGetSelection() {
      if (typeof selection !== 'string') {
        throw new TypeError(`Invalid Vec${api.n}.get selection type: ${typeof selection}`)
      }

      if (
        selection.length === 0 ||
        selection.length > 4 ||
        !isValidGetSelection(selection, api.n)
      ) {
        throw new Error(`Invalid Vec${api.n}.get selection '${selection}'`)
      }
    })()

    if (selection.length === 1) {
      return api[mergedIndexMap[selection[0]]]
    }

    const newApi: VectorApi = { n: selection.length }
    for (let i = 0; i < selection.length; i++) {
      newApi[i] = api[mergedIndexMap[selection[i]]]
    }

    return createVec(newApi)
  }

  vec.set = (selection, other) => {
    ;(function validateSetSelection() {
      if (typeof selection !== 'string') {
        throw new TypeError(`Invalid Vec${api.n}.set selection type: ${typeof selection}`)
      }

      if (
        selection.length === 0 ||
        selection.length > api.n ||
        !isValidGetSelection(selection, api.n) ||
        new Set(selection.split('')).size !== selection.length
      ) {
        throw new Error(`Invalid Vec${api.n}.set selection '${selection}'`)
      }

      if (selection.length === 1) {
        if (typeof other !== 'number') {
          throw new Error(`Invalid Vec${api.n}.set '${selection}' selection value. Must be number`)
        }
      } else {
        if (!isVector(other) || other[API_SYMBOL].n !== selection.length) {
          throw new Error(
            `Invalid Vec${api.n}.set '${selection}' selection value. Must be Vec${selection.length}`,
          )
        }
      }
    })()

    const otherAt = typeof other === 'number' ? () => other : (i: number) => other[i]

    for (let i = 0; i < selection.length; i++) {
      api[mergedIndexMap[selection[i]]] = otherAt(i)
    }
  }

  vec.copy = () => {
    const newApi: VectorApi = { n: api.n }
    for (let i = 0; i < api.n; i++) {
      newApi[i] = api[i]
    }
    return createVec(newApi)
  }

  vec.toString = () => {
    let str = `vec${api.n}(`
    for (let i = 0; i < api.n; i++) str += `${api[i]}, `
    return str.substring(0, str.length - 2) + ')'
  }

  return vec
}

const vec =
  (n: number) =>
  (...args: any[]) => {
    if (args.length === 1 && typeof args[0] === 'number') {
      const api: VectorApi = { n }
      for (let i = 0; i < n; i++) {
        api[i] = args[0]
      }

      return createVec(api)
    } else {
      const api = parseArgsToApi(args)

      if (!api || api.n !== n) {
        throw new Error(`Invalid Vec${n} create args`)
      }

      return createVec(api)
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
