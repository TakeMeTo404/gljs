import { operations } from './const'
import type { Vec2, Vec3, Vec4, VecCreateArgs } from './types/vec'

const xyzw: string[] = ['x', 'y', 'z', 'w']
const rgba: string[] = ['r', 'g', 'b', 'a']

const selectionIndexMap: Record<string, number> = {
  x: 0,
  y: 1,
  z: 2,
  w: 3,

  r: 0,
  g: 1,
  b: 2,
  a: 3,
}

export type VectorApi = {
  n: number
} & Record<number, number>

export const isVector = (v: unknown): v is BaseVector => {
  return Boolean(v) && typeof v === 'function' && typeof (v as any)._api.n === 'number'
}

export const parseArgsToApi = (args: unknown[]): VectorApi => {
  const api: VectorApi = { n: 0 }

  for (const arg of args) {
    if (typeof arg === 'number') {
      api[api.n] = arg
      api.n++
    } else if (isVector(arg)) {
      for (let i = 0; i < arg._api.n; i++) {
        api[api.n] = arg[i]
        api.n++
      }
    } else {
      throw new Error('Vector and matrix constructors accept only numbers and other vectors')
    }
  }

  return api
}

export type BaseVector = {
  _api: VectorApi

  get: (selection: string) => number | BaseVector
  set: (selection: string, other: number | BaseVector) => void

  copy: () => BaseVector
} & Record<number, number> &
  Iterable<number>

export const createVec = (api: VectorApi) => {
  const vec: BaseVector = ((op: string, other: number | BaseVector) => {
    // todo: assert args

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

  vec._api = api

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
    // todo: assert args

    if (selection.length === 1) {
      return api[selectionIndexMap[selection[0]]]
    }

    const newApi: VectorApi = { n: selection.length }
    for (let i = 0; i < selection.length; i++) {
      newApi[i] = api[selectionIndexMap[selection[i]]]
    }

    return createVec(newApi)
  }

  vec.set = (selection, other) => {
    const otherAt = typeof other === 'number' ? () => other : (i: number) => other[i]

    for (let i = 0; i < selection.length; i++) {
      api[selectionIndexMap[selection[i]]] = otherAt(i)
    }
  }

  vec.copy = () => {
    const newApi = { ...api }
    return createVec(newApi)
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

      if (api.n !== n) {
        throw new Error(`Cannot create Vec${n}. Need ${n} components, but given ${api.n}`)
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
export const vec4 = vec(4) as any as <Args extends (number | Vec2 | Vec4)[]>(
  ...args: VecCreateArgs<4, Args>
) => Vec4
