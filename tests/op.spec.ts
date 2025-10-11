import { describe, it, expect } from 'vitest'
import { cross, distance, dot, length, vec2, vec3, vec4 } from '../dist'

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
})
