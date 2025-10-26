import { memoize } from 'lodash'
import {
  mat2,
  mat2x3,
  mat2x4,
  mat3,
  mat3x2,
  mat3x4,
  mat4,
  mat4x2,
  mat4x3,
  Vec2,
  vec2,
  Vec3,
  vec3,
  Vec4,
  vec4,
} from '../dist'

export const findSequences = memoize(function findSequences(N: number): number[][] {
  const result: number[][] = []
  const path: number[] = []

  function backdrop(sum: number) {
    if (sum === N) {
      result.push([...path])
      return
    }

    for (let i = 1; i <= 4; i++) {
      if (sum + i <= N) {
        path.push(i)
        backdrop(sum + i)
        path.pop()
      }
    }
  }

  backdrop(0)
  return result
})

export const createVec = (n: number, args: any[]) => {
  switch (n) {
    case 1:
      return args[0]
    case 2:
      return vec2(...args)
    case 3:
      return vec3(...args)
    case 4:
      return vec4(...args)
    default:
      throw new Error()
  }
}

export const matRxC: Record<
  number,
  Record<number, (...args: (number | Vec2 | Vec3 | Vec4)[]) => unknown>
> = {
  2: {
    2: mat2,
    3: mat2x3,
    4: mat2x4,
  },
  3: {
    2: mat3x2,
    3: mat3,
    4: mat3x4,
  },
  4: {
    2: mat4x2,
    3: mat4x3,
    4: mat4,
  },
}

export const distribute = (numbers: number[], sizes: number[]): number[][] => {
  const result: number[][] = []
  const rest = [...numbers]

  for (const size of sizes) {
    result.push(rest.splice(0, size))
  }

  return result
}

export const createMatFromDistribution = (r: number, c: number, argsDistribution: number[][]) => {
  return matRxC[r][c](...argsDistribution.map((numbers) => createVec(numbers.length, numbers)))
}

export const createVecFromDistribution = (n: number, argsDistribution: number[][]) => {
  return createVec(
    n,
    argsDistribution.map((numbers) => createVec(numbers.length, numbers)),
  )
}

export const matrixToArray = (m: any) => {
  if (typeof m?._api?.r !== 'number') throw new Error('not matrix')

  let result: number[] = []

  let i = 0
  while (m[i]) {
    let j = 0
    while (typeof m[i][j] === 'number') {
      result.push(m[i][j])
      j++
    }

    i++
  }

  return result
}
