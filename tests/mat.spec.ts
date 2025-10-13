import { describe, it, expect } from 'vitest'
import { Mat2, mat2, mat2x3, mat4x3, Vec2, vec2, vec3, vec4 } from '../dist'
import { matrixToArray } from './utils'

describe('mat', () => {
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
