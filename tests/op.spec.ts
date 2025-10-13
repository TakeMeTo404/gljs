import { describe, it, expect } from 'vitest'
import { cross, distance, dot, inverse, length, mat3, normalize, vec2, vec3, vec4 } from '../dist'
import { matrixToArray } from './utils'

describe('op', () => {
  it('length', () => {
    expect(length(7)).toBe(7)

    expect(length(vec2(3, 4))).toBe(5)
    expect(length(vec3(0, 3, 4))).toBe(5)
    expect(length(vec4(7, -7, -7, 7))).toBe(14)
  })

  it('distance', () => {
    expect(distance(5, 7)).toBe(2)
    expect(distance(7, 5)).toBe(2)
    expect(distance(-1, -3)).toBe(2)
    expect(distance(-3, 2)).toBe(5)

    expect(distance(vec2(0), vec2(3, 4))).toBe(5)

    expect(distance(vec3(7, 0, -24), vec3(0, 0, 0))).toBe(25)
  })

  it('dot', () => {
    expect(dot(2, 5)).toBe(10)

    expect(dot(vec2(1, 2), vec2(3, 4))).toBe(11)
  })

  it('cross', () => {
    expect([...cross(vec3(1, 2, 3), vec3(4, 5, 6))]).toEqual([-3, 6, -3])
  })

  it('normalize', () => {
    expect(normalize(Math.random() * 100)).toBe(1)

    expect([...normalize(vec2(7, 0))]).toEqual([1, 0])
    expect([...normalize(vec3(0, 0, -5))]).toEqual([0, 0, -1])

    expect([...normalize(vec2(3, -4))]).toEqual([3 / 5, -4 / 5])
  })

  it('inverse', () => {
    expect(matrixToArray(inverse(mat3(vec3(2, 5, 7), vec3(6, 3, 4), vec3(5, -2, -3))))).toEqual([
      1, -1, 1, -38, 41, -34, 27, -29, 24,
    ])
  })
})
