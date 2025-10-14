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
import {
  createMatFromDistribution,
  createVec,
  distribute,
  findSequences,
  matrixToArray,
  matRxC,
} from './utils'
import { memoize, random, repeat, sampleSize, times } from 'lodash'

describe('mat', () => {
  it('create', () => {
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

    expect(matrixToArray(mat4x3(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])

    // valid components count
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (const seq of findSequences(r * c)) {
          const values = times(r * c, Math.random)

          expect(matrixToArray(createMatFromDistribution(r, c, distribute(values, seq)))).toEqual(
            values,
          )
        }
      }
    }

    // invalid components count
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (let n = 2; n < 18; n++) {
          if (r * c === n) continue

          for (const seq of sampleSize(findSequences(n), 20)) {
            const values = times(n, random)

            expect(() => createMatFromDistribution(r, c, distribute(values, seq))).toThrow()
          }
        }
      }
    }

    const m3 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
    expect(matrixToArray(mat2(m3))).toEqual([1, 2, 4, 5])
    expect(matrixToArray(mat2x3(m3))).toEqual([1, 2, 3, 4, 5, 6])
    expect(matrixToArray(mat3x2(m3))).toEqual([1, 2, 4, 5, 7, 8])

    const m4 = mat4(16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
    expect(matrixToArray(mat2(m4))).toEqual([16, 15, 12, 11])
    expect(matrixToArray(mat3(m4))).toEqual([16, 15, 14, 12, 11, 10, 8, 7, 6])
    expect(matrixToArray(mat4(m4))).toEqual([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
    expect(matrixToArray(mat2x4(m4))).toEqual([16, 15, 14, 13, 12, 11, 10, 9])

    expect(matrixToArray(mat2x3(mat3x4(12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)))).toEqual([
      12, 11, 10, 8, 7, 6,
    ])

    // TODO: write tests for creation bigger matrix from smaller
  })

  it('rowApi and columnApi', () => {
    const m1 = mat2x3(vec3(7), vec3(2, 4, 1))

    expect([...m1[0]]).toEqual([7, 7, 7])
    expect([...m1[1]]).toEqual([2, 4, 1])

    expect([...m1.columns[0]]).toEqual([7, 2])
    expect([...m1.columns[1]]).toEqual([7, 4])
    expect([...m1.columns[2]]).toEqual([7, 1])

    const m2 = mat2(10, 7, -7, 2)

    expect([...m2[0].get('xxx')]).toEqual([10, 10, 10])
    expect([...m2[1].get('yy')]).toEqual([2, 2])
    expect(m2.columns[0].get('r')).toBe(10)
    expect(m2.columns[1].get('g')).toBe(2)
    expect([...m2.columns[1].get('yxyx')]).toEqual([2, 7, 2, 7])

    const m3 = mat3x4(12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
    expect(matrixToArray(m3)).toEqual([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    m3[0][0] *= -1
    expect(matrixToArray(m3)).toEqual([-12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    m3[1][1] += 10
    expect(matrixToArray(m3)).toEqual([-12, 11, 10, 9, 8, 17, 6, 5, 4, 3, 2, 1])

    m3.columns[0][2] = 0
    expect(matrixToArray(m3)).toEqual([-12, 11, 10, 9, 8, 17, 6, 5, 0, 3, 2, 1])

    m3[0] = vec4(5, 5, 5, 5)
    expect(matrixToArray(m3)).toEqual([5, 5, 5, 5, 8, 17, 6, 5, 0, 3, 2, 1])

    m3.columns[1] = vec3(8, 8, 8)
    expect(matrixToArray(m3)).toEqual([5, 8, 5, 5, 8, 8, 6, 5, 0, 8, 2, 1])

    const m4 = mat2(0, 1, 2, 3)
    expect(matrixToArray(m4)).toEqual([0, 1, 2, 3])

    const row = m4[0]
    expect([...row]).toEqual([0, 1])
    row[0] = 5
    expect(m4[0][0]).toBe(5)
    expect(matrixToArray(m4)).toEqual([5, 1, 2, 3])
    row[1] = 6
    expect(matrixToArray(m4)).toEqual([5, 6, 2, 3])
    row.set('xy', vec2(-3, -3))
    expect(matrixToArray(m4)).toEqual([-3, -3, 2, 3])

    const rowCopy = m4[1].copy()
    rowCopy[0] = Math.random()
    expect(matrixToArray(m4)).toEqual([-3, -3, 2, 3])
    rowCopy[1] = Math.random()
    expect(matrixToArray(m4)).toEqual([-3, -3, 2, 3])
    rowCopy.set('gr', vec2(Math.random(), Math.random()))
    expect(matrixToArray(m4)).toEqual([-3, -3, 2, 3])

    const m5 = mat3(0, 1, 2, 3, 4, 5, 6, 7, 8)
    const column = m5.columns[1]
    expect([...column]).toEqual([1, 4, 7])
    column[2] = 5
    expect(m5[2][1]).toBe(5)
    expect(m5.columns[1][2]).toBe(5)
    expect(matrixToArray(m5)).toEqual([0, 1, 2, 3, 4, 5, 6, 5, 8])
    column[1] = 6
    expect(matrixToArray(m5)).toEqual([0, 1, 2, 3, 6, 5, 6, 5, 8])
    column.set('zx', vec2(-3, -6))
    expect(matrixToArray(m5)).toEqual([0, -6, 2, 3, 6, 5, 6, -3, 8])

    const columnCopy = m5.columns[2].copy()
    columnCopy[0] = Math.random()
    expect(matrixToArray(m5)).toEqual([0, -6, 2, 3, 6, 5, 6, -3, 8])
    columnCopy[1] = Math.random()
    expect(matrixToArray(m5)).toEqual([0, -6, 2, 3, 6, 5, 6, -3, 8])
    columnCopy.set('gr', vec2(Math.random(), Math.random()))
    expect(matrixToArray(m5)).toEqual([0, -6, 2, 3, 6, 5, 6, -3, 8])
  })

  it('callable', () => {
    expect(matrixToArray(mat2(2)('+', 7))).toEqual([9, 7, 7, 9])

    expect(matrixToArray(mat4x2(8, 7, 6, 5, 4, 3, 2, 1)('*', -1))).toEqual([
      -8, -7, -6, -5, -4, -3, -2, -1,
    ])

    expect(matrixToArray(mat4x2(16, 14, 12, 10, 8, 6, 4, 2)('/', 2))).toEqual([
      8, 7, 6, 5, 4, 3, 2, 1,
    ])

    expect(matrixToArray(mat2(10, -12, 5, 6)('+', 7)('-', 7))).toEqual(
      matrixToArray(mat2(10, -12, 5, 6)),
    )

    const m1 = mat3x2(1, 2, 3, 4, 5, 6)
    const m2 = mat3x2(7, 7, 7, 7, 7, 7)
    expect(matrixToArray(m1('+', m2))).toEqual([8, 9, 10, 11, 12, 13])

    expect(matrixToArray(m2('-', m1)('+', m1)('-', m1))).toEqual([6, 5, 4, 3, 2, 1])

    expect(matrixToArray(m1('-', m1)('+', 2)('/', m2))).toEqual([
      2 / 7,
      2 / 7,
      2 / 7,
      2 / 7,
      2 / 7,
      2 / 7,
    ])

    // TODO: matrix multiplication tests
  })

  it('copy', () => {
    // TODO
  })
})
