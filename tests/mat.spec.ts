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
import { random, range, sampleSize, sum, times } from 'lodash'

describe('mat', () => {
  it('create from scalar', () => {
    expect(matrixToArray(mat2(7))).toEqual([7, 0, 0, 7])
    expect(matrixToArray(mat3(-2))).toEqual([-2, 0, 0, 0, -2, 0, 0, 0, -2])
    expect(matrixToArray(mat4(8))).toEqual([8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8])

    expect(matrixToArray(mat2x3(6))).toEqual([6, 0, 0, 0, 6, 0])
    expect(matrixToArray(mat3x2(6))).toEqual([6, 0, 0, 6, 0, 0])

    expect(matrixToArray(mat2x4(77))).toEqual([77, 0, 0, 0, 0, 77, 0, 0])
    expect(matrixToArray(mat4x2(-12))).toEqual([-12, 0, 0, -12, 0, 0, 0, 0])

    expect(matrixToArray(mat3x4(2))).toEqual([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0])
    expect(matrixToArray(mat4x3(10))).toEqual([10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0])
    expect(matrixToArray(mat4x3(0))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  })

  it('create from diagonal', () => {
    expect(matrixToArray(mat2(vec2(4, 6)))).toEqual([4, 0, 0, 6])

    expect(matrixToArray(mat3x4(vec3(2, 3, 4)))).toEqual([2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0])

    expect(() => mat3x4(vec4(1) as any)).toThrow()

    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (let i = 2; i < 4; i++) {
          const values = times(i, Math.random)
          const diagonal = createVec(i, values)

          if (i === Math.min(r, c)) {
            const m = matRxC[r][c](diagonal)
            expect(sum(matrixToArray(m))).toBe(sum(values))
          } else {
            expect(() => matRxC[r][c](diagonal)).toThrow()
          }
        }
      }
    }
  })

  it('create from other matrix', () => {
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

    expect(matrixToArray(mat3(mat2(7)))).toEqual([7, 0, 0, 0, 7, 0, 0, 0, 1])

    expect(matrixToArray(mat4(mat2x4(2, 3, 4, 5, 6, 7, 8, 9)))).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 1, 0, 0, 0, 0, 1,
    ])

    for (let r1 = 2; r1 <= 4; r1++) {
      for (let c1 = 2; c1 <= 4; c1++) {
        for (let r2 = 2; r2 <= 4; r2++) {
          for (let c2 = 2; c2 <= 4; c2++) {
            const values = times(r1 * c1, Math.random)

            const m1 = matRxC[r1][c1](...values) as any
            const m2 = matRxC[r2][c2](m1) as any

            for (let i = 0; i < r2; i++) {
              for (let j = 0; j < c2; j++) {
                if (i < Math.min(r1, r2) && j < Math.min(c1, c2)) {
                  expect(m2[i][j]).toEqual(m1[i][j])
                } else if (i === j) {
                  expect(m2[i][j]).toEqual(1)
                } else {
                  expect(m2[i][j]).toEqual(0)
                }
              }
            }
          }
        }
      }
    }
  })

  it('create from components array', () => {
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
  })

  it('create invalid', () => {
    expect(() => (mat2 as any)()).toThrow('Invalid Mat2 create args')
    expect(() => (mat2 as any)([1, 2, 3, 4])).toThrow('Invalid Mat2 create args')
    expect(() => (mat3 as any)(null)).toThrow('Invalid Mat3 create args')
    expect(() => (mat4 as any)(undefined)).toThrow('Invalid Mat4 create args')
    expect(() => (mat2x3 as any)(function () {})).toThrow('Invalid Mat2x3 create args')
    expect(() => (mat2x4 as any)('1')).toThrow('Invalid Mat2x4 create args')
    expect(() => (mat3x2 as any)(Symbol.keyFor)).toThrow('Invalid Mat3x2 create args')
    expect(() => (mat3x2 as any)([])).toThrow('Invalid Mat3x2 create args')
    expect(() => (mat4x2 as any)(times(8, Math.random))).toThrow('Invalid Mat4x2 create args')
    expect(() => (mat4x3 as any)(vec4(2))).toThrow('Invalid Mat4x3 create args')

    // invalid components count
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        for (let n = 2; n < 18; n++) {
          if (r * c === n) continue

          for (const seq of sampleSize(findSequences(n), 20)) {
            if (n === Math.min(r, c) && seq.length === 1) {
              // create matrix from diagonal vector is OK
              continue
            }

            const values = times(n, random)

            expect(() => createMatFromDistribution(r, c, distribute(values, seq))).toThrow()
          }
        }
      }
    }
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

  it('set invalid rows and columns', () => {
    const m2 = mat2(1) as any

    ;[
      null,
      undefined,
      0,
      [1, 2],
      { x: 1, y: 1 },
      [],
      {},
      '',
      function () {},
      Symbol.iterator,
      vec3(1),
      vec4(1),
    ].forEach((value) => {
      expect(() => (m2[0] = value)).toThrow(`Invalid Mat2 row value. Must be Vec2`)
      expect(() => (m2.columns[0] = value)).toThrow(`Invalid Mat2 column value. Must be Vec2`)
    })

    const m3x4 = mat3x4(1) as any
    expect(() => (m3x4[0] = vec2(1))).toThrow(`Invalid Mat3x4 row value. Must be Vec4`)
    expect(() => (m3x4[0] = vec3(1))).toThrow(`Invalid Mat3x4 row value. Must be Vec4`)
    expect(() => (m3x4.columns[0] = vec2(1))).toThrow(`Invalid Mat3x4 column value. Must be Vec3`)
    expect(() => (m3x4.columns[0] = vec4(1))).toThrow(`Invalid Mat3x4 column value. Must be Vec3`)
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

    expect(matrixToArray(mat2x3(1, 2, 3, 4, 5, 6)('*', 3))).toEqual([3, 6, 9, 12, 15, 18])

    expect([...mat2(2)('*', vec2(2, 4))]).toEqual([4, 8])

    expect(matrixToArray(mat2(1, 2, 3, 4)('*', mat2(5, 6, 7, 8)))).toEqual([19, 22, 43, 50])

    expect(
      matrixToArray(mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)('*', mat3(9, 8, 7, 6, 5, 4, 3, 2, 1))),
    ).toEqual([30, 24, 18, 84, 69, 54, 138, 114, 90])

    expect(matrixToArray(mat4(...range(1, 17))('*', mat4(...range(16, 0, -1))))).toEqual([
      80, 70, 60, 50, 240, 214, 188, 162, 400, 358, 316, 274, 560, 502, 444, 386,
    ])

    // Matrix * Vector multiplication tests
    expect([...mat2(1, 2, 3, 4)('*', vec2(5, 6))]).toEqual([17, 39])

    expect([...mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)('*', vec3(10, 11, 12))]).toEqual([68, 167, 266])

    expect([
      ...mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)('*', vec4(17, 18, 19, 20)),
    ]).toEqual([190, 486, 782, 1078])

    // Non-square matrix * vector multiplication tests
    expect([...mat2x3(1, 2, 3, 4, 5, 6)('*', vec3(7, 8, 9))]).toEqual([50, 122])

    expect([...mat3x4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)('*', vec4(13, 14, 15, 16))]).toEqual([
      150, 382, 614,
    ])

    // Identity matrix multiplication tests
    expect(matrixToArray(mat2(1)('*', mat2(5, 6, 7, 8)))).toEqual([5, 6, 7, 8])
    expect(matrixToArray(mat3(1)('*', mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ])
    expect([...mat4(1)('*', vec4(10, 11, 12, 13))]).toEqual([10, 11, 12, 13])

    // Zero matrix multiplication tests
    expect(matrixToArray(mat2(0)('*', mat2(1, 2, 3, 4)))).toEqual([0, 0, 0, 0])
    expect([...mat3(0)('*', vec3(5, 6, 7))]).toEqual([0, 0, 0])

    expect(
      matrixToArray(
        mat3x4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)('*', mat4x2(13, 14, 15, 16, 17, 18, 19, 20)),
      ),
    ).toEqual([170, 180, 426, 452, 682, 724])

    for (let r1 = 2; r1 <= 4; r1++) {
      for (let c1 = 2; c1 <= 4; c1++) {
        for (let r2 = 2; r2 <= 4; r2++) {
          for (let c2 = 2; c2 <= 4; c2++) {
            const m1 = matRxC[r1][c1](1) as any
            const m2 = matRxC[r2][c2](1) as any

            if (c1 === r2) {
              expect(matrixToArray(m1('*', m2)).length).toBe(r1 * c2)
            }
          }
        }
      }
    }
  })

  it('copy', () => {
    const m1 = mat2(vec4(1, 2, 3, 4))

    expect(matrixToArray(m1)).toEqual([1, 2, 3, 4])

    let m2 = m1.copy()
    expect(matrixToArray(m2)).toEqual([1, 2, 3, 4])

    m2[0][0] = 6
    expect(matrixToArray(m2)).toEqual([6, 2, 3, 4])
    expect(matrixToArray(m1)).toEqual([1, 2, 3, 4])

    m2.columns[1].set('x', 10)
    expect(matrixToArray(m2)).toEqual([6, 10, 3, 4])
    expect(matrixToArray(m1)).toEqual([1, 2, 3, 4])

    m1[0] = vec2(-2, -4)
    expect(matrixToArray(m1)).toEqual([-2, -4, 3, 4])
    expect(matrixToArray(m2)).toEqual([6, 10, 3, 4])

    m2 = m1.copy()
    m2.columns[0] = vec2(10, 20)
    expect(matrixToArray(m1)).toEqual([-2, -4, 3, 4])
    expect(matrixToArray(m2)).toEqual([10, -4, 20, 4])
  })
})
