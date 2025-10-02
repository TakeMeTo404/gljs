import type { Vec2, Vec3, Vec4 } from './types/vec'

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

const operations: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

type Api = {
  n: number
} & Record<number, number>

const parseArgs = (n: number, ...args: any[]): Api => {
  const api: Api = {
    n,
  }

  // repeat one scalar
  if (args.length === 1 && typeof args[0] === 'number') {
    for (let i = 0; i < n; i++) api[i] = args[0]
    return api
  }

  // given N args – N scalars
  if (args.length === n) {
    for (let i = 0; i < n; i++) api[i] = args[i] as number
    return api
  }

  // given 1 arg – array of N scalars
  if (Array.isArray(args[0])) {
    for (let i = 0; i < n; i++) api[i] = args[0][i]
    return api
  }

  if (typeof args[0] === 'object' && 'x' in args[0]) {
    for (let i = 0; i < n; i++) {
      api[i] = args[0][xyzw[i]]
    }
    return api
  }
  if (typeof args[0] === 'object' && 'r' in args[0]) {
    for (let i = 0; i < n; i++) api[i] = args[0][rgba[i]]
    return api
  }

  if (n === 2) {
    // now we assume args = [Vec2]
    api[0] = args[0][0]
    api[1] = args[0][1]
  } else if (n === 3) {
    if (args.length === 1) {
      // args: [Vec3]
      api[0] = args[0][0]
      api[1] = args[0][1]
      api[2] = args[0][2]
    } else {
      if (typeof args[0] === 'number') {
        // args: [number, Vec2]
        api[0] = args[0]
        api[1] = args[1][0]
        api[2] = args[1][1]
      } else {
        // args: [Vec2, number]
        api[0] = args[0][0]
        api[1] = args[0][1]
        api[2] = args[1]
      }
    }
  } else {
    if (args.length === 1) {
      // args: [Vec4]
      api[0] = args[0][0]
      api[1] = args[0][1]
      api[2] = args[0][2]
      api[3] = args[0][3]
    } else if (args.length === 2) {
      if (typeof args[0] === 'number') {
        // args: [number, Vec3]
        api[0] = args[0]
        api[1] = args[1][0]
        api[2] = args[1][1]
        api[3] = args[1][2]
      } else {
        // args: [Vec3, number]
        api[0] = args[0][0]
        api[1] = args[0][1]
        api[2] = args[0][2]
        api[3] = args[1]
      }
    } else {
      if (typeof args[0] !== 'number') {
        // args: [Vec2, number, number]
        api[0] = args[0][0]
        api[1] = args[0][1]
        api[2] = args[1]
        api[3] = args[2]
      } else if (typeof args[1] !== 'number') {
        // args: [number, Vec2, number]
        api[0] = args[0]
        api[1] = args[1][0]
        api[2] = args[1][1]
        api[3] = args[2]
      } else {
        // args: [number, number, Vec2]
        api[0] = args[0]
        api[1] = args[1]
        api[2] = args[2][0]
        api[3] = args[2][1]
      }
    }
  }

  return api
}

type Vec = {
  get: (selection: string) => number | Vec
  set: (selection: string, other: number | Vec) => void

  copy: () => Vec
} & Record<number, number> &
  Iterable<number>

export const createVec = (api: Api) => {
  const vec: Vec = ((op: string, other: number | Vec) => {
    // todo: assert args

    const isAssignOperation = !(op in operations)

    const f = isAssignOperation ? operations[op[0]] : operations[op]

    const otherAt = typeof other === 'number' ? () => other : (i: number) => other[i] as number

    if (isAssignOperation) {
      for (let i = 0; i < api.n; i++) {
        api[i] = f(api[i], otherAt(i))
      }
    } else {
      const newApi: Api = {
        n: api.n,
      }

      for (let i = 0; i < api.n; i++) {
        newApi[i] = f(api[i], otherAt(i))
      }

      return createVec(newApi)
    }
  }) as any as Vec

  vec[Symbol.iterator] = function* () {
    for (let i = 0; i < api.n; i++) {
      yield api[i] as number
    }
  }

  // define index properties
  for (let i = 0; i < api.n; i++) {
    Object.defineProperty(vec, i, {
      get() {
        return api[i]
      },

      set(v) {
        api[i] = v
      },
    })
  }

  vec.get = (selection) => {
    // todo: assert args

    if (selection.length === 1) {
      return api[selectionIndexMap[selection[0]]]
    }

    const newApi: Api = { n: selection.length }
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
    const api = parseArgs(n, ...args)

    return createVec(api)
  }

export const vec2 = vec(2) as any as Vec2
export const vec3 = vec(3) as any as Vec3
export const vec4 = vec(4) as any as Vec4
