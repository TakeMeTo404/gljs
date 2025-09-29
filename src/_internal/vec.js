import { operations } from '../const'

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

const createCallableVector = (api) => {
  return (op, other) => {
    // todo: assert args

    const isAssignOperation = !(op in operations)

    const f = isAssignOperation ? operations[op[0]] : operations[op]

    const otherAt = typeof other === 'number' ? () => other : (i) => other[i]

    if (isAssignOperation) {
      for (let i = 0; i < api.n; i++) {
        api[i] = f(api[i], otherAt(i))
      }
    } else {
      const newApi = {
        n: api.n,
      }

      for (let i = 0; i < api.n; i++) {
        newApi[i] = f(api[i], otherAt(i))
      }

      return createVec(newApi)
    }
  }
}

const defineIndexProperties = (vec, api) => {
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
}

const defineGet = (vec, api) => {
  vec.get = (selection) => {
    // todo: assert args

    if (selection.length === 1) {
      return api[selectionIndexMap[selection[0]]]
    }

    const newApi = { n: selection.length }
    for (let i = 0; i < selection.length; i++) {
      newApi[i] = api[selectionIndexMap[selection[i]]]
    }

    return createVec(newApi)
  }
}

const defineSet = (vec, api) => {
  vec.set = (selection, other) => {
    const otherAt = typeof other === 'number' ? () => other : (i) => other[i]

    for (let i = 0; i < selection.length; i++) {
      api[selectionIndexMap[selection[i]]] = otherAt(i)
    }
  }
}

// api: { n: 2 | 3 | 4 } & Record<0..n, number>
export const createVec = (api) => {
  const vec = createCallableVector(api)

  vec[Symbol.iterator] = function* () {
    for (let i = 0; i < api.n; i++) {
      yield api[i]
    }
  }

  defineIndexProperties(vec, api)

  defineGet(vec, api)
  defineSet(vec, api)

  vec.copy = () => {
    const newApi = { ...api }
    return createVec(newApi)
  }

  return vec
}
