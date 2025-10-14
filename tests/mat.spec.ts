import { describe, it, expect } from 'vitest'
import {
  Mat2,
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
import { matrixToArray } from './utils'
import { memoize, sampleSize } from 'lodash'

const mat: Record<number, Record<number, (...args: any[]) => any>> = {
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

const createVec = (n: number, args: number[]) => {
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

const findSequences = memoize(function findSequences(N: number): number[][] {
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

describe('mat', () => {
  it('hahaha', () => {
    console.log(findSequences(16).length)
  })

  it('create mat2', () => {
    expect(matrixToArray(mat2(1, 2, 3, 4))).toEqual([1, 2, 3, 4])

    expect(matrixToArray(mat2(vec2(1, 2), 3, 4))).toEqual([1, 2, 3, 4])

    expect(matrixToArray(mat2(vec2(1, 2), vec2(3, 4)))).toEqual([1, 2, 3, 4])

    expect(matrixToArray(mat2(vec3(1, 2, 3), 4))).toEqual([1, 2, 3, 4])

    expect(matrixToArray(mat2(1, vec3(2, 3, 4)))).toEqual([1, 2, 3, 4])

    expect(matrixToArray(mat2(vec4(1, 2, 3, 4)))).toEqual([1, 2, 3, 4])

    const arr: number[] = [1, 2, 3, 4]
    expect(matrixToArray(mat2(...arr))).toEqual([1, 2, 3, 4])

    const strange: (number | Vec2)[] = [1, vec2(2, 3), 4]

    expect(matrixToArray(mat2(...strange))).toEqual([1, 2, 3, 4])
  })

  it('create mat4x3', () => {
    expect(matrixToArray(mat4x3(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('create from components', () => {

    function createMatrixFromSeq(r: number, c: number, seq: number[], values: number[]) {
      const matrixConstructorArgs: (number | Vec2 | Vec3 | Vec4)[] = []

      const restValues = [...values]

      for (const n of seq) {
        const vectorConstructorArgs = restValues.splice(0, n)

        matrixConstructorArgs.push(createVec(n, vectorConstructorArgs))
      }

      return mat[r][c](...matrixConstructorArgs)
    }

    // valid args
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (const seq of findSequences(r * c)) {
          const values = Array(r * c)
            .fill(0)
            .map(() => Math.random())

          expect(matrixToArray(createMatrixFromSeq(r, c, seq, values))).toEqual(values)
        }
      }
    }

    // invalid args
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (let n = 2; n < 18; n++) {

          if (r * c === n) continue

          for (const seq of sampleSize(findSequences(n), 20)) {
            const values = Array(n)
              .fill(0)
              .map(() => Math.random())

            expect(() => createMatrixFromSeq(r, c, seq, values)).toThrow()
          }

        }
      }
    }
  })

  it('read rowApi and columnApi', () => {
    let m = mat2x3(vec3(7), vec3(2, 4, 1))

    expect([...m[0]]).toEqual([7, 7, 7])
    expect([...m[1]]).toEqual([2, 4, 1])

    expect([...m.columns[0]]).toEqual([7, 2])
    expect([...m.columns[1]]).toEqual([7, 4])
    expect([...m.columns[2]]).toEqual([7, 1])
  })

  it('matcallable', () => {
    expect(matrixToArray(mat2(3))).toEqual([3, 0, 0, 3])

    expect(matrixToArray(mat2(2)('+', 7))).toEqual([9, 7, 7, 9])
  })
})
