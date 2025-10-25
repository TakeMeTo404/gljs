import { describe, it, expect } from 'vitest'
import {
  abs,
  acos,
  acosh,
  asin,
  asinh,
  atan,
  atanh,
  ceil,
  clamp,
  cos,
  cosh,
  cross,
  degrees,
  distance,
  dot,
  exp,
  exp2,
  floor,
  fract,
  inverse,
  inversesqrt,
  length,
  log,
  log2,
  mat3,
  max,
  min,
  mix,
  mod,
  normalize,
  pow,
  radians,
  round,
  sign,
  sin,
  sinh,
  smoothstep,
  sqrt,
  step,
  tan,
  tanh,
  transpose,
  trunc,
  vec2,
  vec3,
  vec4,
} from '../dist'
import { matrixToArray, matRxC } from './utils'
import { sum, times } from 'lodash'

describe('op', () => {
  it('exp', () => {
    expect(exp(0)).toBe(1)
    expect(exp(1)).toBeCloseTo(Math.E)
    expect([...exp(vec2(0, 1))]).toEqual([1, Math.E])

    expect(exp(vec3(0, 1, 2))[0]).toBe(1)
    expect(exp(vec3(0, 1, 2))[1]).toBe(Math.E)
    expect(exp(vec3(0, 1, 2))[2]).toBeCloseTo(Math.E * Math.E)
  })

  it('sqrt', () => {
    expect(sqrt(4)).toBe(2)
    expect(sqrt(9)).toBe(3)
    expect([...sqrt(vec2(4, 16))]).toEqual([2, 4])
    expect([...sqrt(vec3(9, 25, 100))]).toEqual([3, 5, 10])
  })

  it('inversesqrt', () => {
    expect(inversesqrt(4)).toBe(0.5)
    expect(inversesqrt(16)).toBe(0.25)
    expect([...inversesqrt(vec2(4, 16))]).toEqual([0.5, 0.25])
  })

  it('log', () => {
    expect(log(1)).toBe(0)
    expect(log(Math.E)).toBeCloseTo(1)
    expect([...log(vec2(1, Math.E))]).toEqual([0, 1])
  })

  it('exp2', () => {
    expect(exp2(0)).toBe(1)
    expect(exp2(3)).toBe(8)
    expect([...exp2(vec2(0, 3))]).toEqual([1, 8])
  })

  it('log2', () => {
    expect(log2(1)).toBe(0)
    expect(log2(8)).toBe(3)
    expect([...log2(vec2(1, 8))]).toEqual([0, 3])
  })

  it('abs', () => {
    expect(abs(-5)).toBe(5)
    expect(abs(5)).toBe(5)
    expect([...abs(vec2(-1, 2))]).toEqual([1, 2])
    expect([...abs(vec3(-1, -2, 3))]).toEqual([1, 2, 3])
  })

  it('sign', () => {
    expect(sign(-5)).toBe(-1)
    expect(sign(5)).toBe(1)
    expect(sign(0)).toBe(0)
    expect([...sign(vec2(-2, 3))]).toEqual([-1, 1])
  })

  it('floor', () => {
    expect(floor(2.7)).toBe(2)
    expect(floor(-2.7)).toBe(-3)
    expect([...floor(vec2(2.7, -2.7))]).toEqual([2, -3])
  })

  it('ceil', () => {
    expect(ceil(2.3)).toBe(3)
    expect(ceil(-2.3)).toBe(-2)
    expect([...ceil(vec2(2.3, -2.3))]).toEqual([3, -2])
  })

  it('round', () => {
    expect(round(2.3)).toBe(2)
    expect(round(2.7)).toBe(3)
    expect([...round(vec2(2.3, 2.7))]).toEqual([2, 3])
  })

  it('fract', () => {
    expect(fract(2.7)).toBeCloseTo(0.7)
    expect(fract(-2.7)).toBeCloseTo(0.3) // -2.7 - (-3) = 0.3
    expect([...fract(vec2(2.7, -2.7))]).toEqual([expect.closeTo(0.7), expect.closeTo(0.3)])
  })

  it('trunc', () => {
    expect(trunc(2.7)).toBe(2)
    expect(trunc(-2.7)).toBe(-2)
    expect([...trunc(vec2(2.7, -2.7))]).toEqual([2, -2])
  })

  it('sin', () => {
    expect(sin(0)).toBe(0)
    expect(sin(Math.PI / 2)).toBeCloseTo(1)
    expect([...sin(vec2(0, Math.PI / 2))]).toEqual([0, 1])
  })

  it('cos', () => {
    expect(cos(0)).toBe(1)
    expect(cos(Math.PI)).toBeCloseTo(-1)
    expect([...cos(vec2(0, Math.PI))]).toEqual([1, -1])
  })

  it('tan', () => {
    expect(tan(0)).toBe(0)
    expect(tan(Math.PI / 4)).toBeCloseTo(1)
    expect(tan(vec2(0, Math.PI / 4))[0]).toBe(0)
    expect(tan(vec2(0, Math.PI / 4))[1]).toBeCloseTo(1)
  })

  it('asin', () => {
    expect(asin(0)).toBe(0)
    expect(asin(1)).toBeCloseTo(Math.PI / 2)
    expect([...asin(vec2(0, 1))]).toEqual([0, Math.PI / 2])
  })

  it('acos', () => {
    expect(acos(1)).toBe(0)
    expect(acos(0)).toBeCloseTo(Math.PI / 2)
    expect([...acos(vec2(1, 0))]).toEqual([0, Math.PI / 2])
  })

  it('atan', () => {
    expect(atan(0)).toBe(0)
    expect(atan(1)).toBeCloseTo(Math.PI / 4)
    expect([...atan(vec2(0, 1))]).toEqual([0, Math.PI / 4])
  })

  it('sinh', () => {
    expect(sinh(0)).toBe(0)
    expect(sinh(1)).toBeCloseTo(Math.sinh(1))
    expect([...sinh(vec2(0, 1))]).toEqual([0, Math.sinh(1)])
  })

  it('cosh', () => {
    expect(cosh(0)).toBe(1)
    expect(cosh(1)).toBeCloseTo(Math.cosh(1))
    expect([...cosh(vec2(0, 1))]).toEqual([1, Math.cosh(1)])
  })

  it('tanh', () => {
    expect(tanh(0)).toBe(0)
    expect(tanh(1)).toBeCloseTo(Math.tanh(1))
    expect([...tanh(vec2(0, 1))]).toEqual([0, Math.tanh(1)])
  })

  it('asinh', () => {
    expect(asinh(0)).toBe(0)
    expect(asinh(1)).toBeCloseTo(Math.asinh(1))
    expect([...asinh(vec2(0, 1))]).toEqual([0, Math.asinh(1)])
  })

  it('acosh', () => {
    expect(acosh(1)).toBe(0)
    expect(acosh(2)).toBeCloseTo(Math.acosh(2))
    expect([...acosh(vec2(1, 2))]).toEqual([0, Math.acosh(2)])
  })

  it('atanh', () => {
    expect(atanh(0)).toBe(0)
    expect(atanh(0.5)).toBeCloseTo(Math.atanh(0.5))
    expect([...atanh(vec2(0, 0.5))]).toEqual([0, Math.atanh(0.5)])
  })

  it('degrees', () => {
    expect(degrees(Math.PI)).toBe(180)
    expect(degrees(Math.PI / 2)).toBe(90)
    expect([...degrees(vec2(Math.PI, Math.PI / 2))]).toEqual([180, 90])
  })

  it('radians', () => {
    expect(radians(180)).toBeCloseTo(Math.PI)
    expect(radians(90)).toBeCloseTo(Math.PI / 2)
    expect([...radians(vec2(180, 90))]).toEqual([Math.PI, Math.PI / 2])
  })

  it('pow', () => {
    expect(pow(2, 5)).toBe(32)
    expect(pow(4, 0.5)).toBe(2)
    expect(pow(5, 0)).toBe(1)
    expect([...pow(vec2(2, 3), vec2(3, 2))]).toEqual([8, 9])
    expect([...pow(vec3(2, 3, 4), 2)]).toEqual([4, 9, 16])
    expect([...pow(vec4(2, 3, 4, 5), -1)]).toEqual([1 / 2, 1 / 3, 1 / 4, 1 / 5])
  })

  it('min', () => {
    expect(min(2, 5)).toBe(2)
    expect(min(4, 0.5)).toBe(0.5)
    expect(min(5, 0)).toBe(0)
    expect([...min(vec2(2, 3), vec2(3, 2))]).toEqual([2, 2])
    expect([...min(vec3(2, 3, 4), 2)]).toEqual([2, 2, 2])
    expect([...min(vec4(2, 3, 4, 5), -1)]).toEqual([-1, -1, -1, -1])
  })

  it('max', () => {
    expect(max(2, 5)).toBe(5)
    expect(max(4, 0.5)).toBe(4)
    expect(max(5, 0)).toBe(5)
    expect([...max(vec2(2, 3), vec2(3, 2))]).toEqual([3, 3])
    expect([...max(vec3(2, 3, 4), 2)]).toEqual([2, 3, 4])
    expect([...max(vec4(2, 3, 4, 5), -1)]).toEqual([2, 3, 4, 5])
  })

  it('mod', () => {
    expect(mod(2, 5)).toBe(2)
    expect(mod(4, 0.5)).toBe(0)
    expect(mod(5, 0)).toBe(NaN) // mod by zero returns NaN in JavaScript
    expect([...mod(vec2(2, 3), vec2(3, 2))]).toEqual([2, 1])
    expect([...mod(vec3(2, 3, 4), 2)]).toEqual([0, 1, 0])
    expect([...mod(vec4(2, 3, 4, 5), -1)]).toEqual([0, 0, 0, 0])
  })

  it('step', () => {
    expect(step(2, 5)).toBe(1)
    expect(step(4, 0.5)).toBe(0)
    expect(step(5, 0)).toBe(0)
    expect([...step(vec2(2, 3), vec2(3, 2))]).toEqual([1, 0])
    expect([...step(vec3(2, 3, 4), 2)]).toEqual([1, 0, 0])
    expect([...step(vec4(2, 3, 4, 5), -1)]).toEqual([0, 0, 0, 0])
  })

  it('clamp', () => {
    expect(clamp(2, 1, 5)).toBe(2)
    expect(clamp(0, 1, 5)).toBe(1)
    expect(clamp(7, 1, 5)).toBe(5)
    expect([...clamp(vec2(2, 0), vec2(1, 1), vec2(5, 5))]).toEqual([2, 1])
    expect([...clamp(vec3(2, 0, 7), 1, 5)]).toEqual([2, 1, 5])
    expect([...clamp(vec4(2, 0, 7, 3), -1, 4)]).toEqual([2, 0, 4, 3])
  })

  it('mix', () => {
    expect(mix(2, 5, 0)).toBe(2)
    expect(mix(2, 5, 1)).toBe(5)
    expect(mix(2, 5, 0.5)).toBe(3.5)
    expect([...mix(vec2(2, 3), vec2(5, 7), vec2(0, 1))]).toEqual([2, 7])
    expect([...mix(vec3(2, 3, 4), 5, 0.5)]).toEqual([3.5, 4, 4.5])
    expect([...mix(vec4(2, 3, 4, 5), -1, 0.5)]).toEqual([0.5, 1, 1.5, 2])
  })

  it('smoothstep', () => {
    expect(smoothstep(2, 5, 1)).toBe(0)
    expect(smoothstep(2, 5, 6)).toBe(1)
    expect(smoothstep(2, 5, 3.5)).toBeCloseTo(0.5)
    expect([...smoothstep(vec2(2, 1), vec2(5, 3), vec2(1, 2))]).toEqual([0, 0.5])
    expect([...smoothstep(vec3(-10, 1, 0), 5, -2.5)]).toEqual([0.5, 0, 0])
  })

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
    expect(dot(vec3(3, 5, 9), vec3(8, 7, -1))).toBe(50)
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

  it('faceforward', () => {})

  it('reflect', () => {})

  it('refract', () => {})

  it('outerProduct', () => {})

  it('transpose', () => {
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        const values = times(r * c, Math.random)

        const m1 = matRxC[r][c](...values) as any
        const m2 = transpose(m1) as any

        expect(m2._api.r).toBe(c)
        expect(m2._api.c).toBe(r)

        expect(sum(matrixToArray(m2))).toBeCloseTo(sum(matrixToArray(m1)), 7)

        for (let i = 0; i < r; i++) {
          expect([...m1[i]]).toEqual([...m2.columns[i]])
        }
        for (let j = 0; j < c; j++) {
          expect([...m1.columns[j]]).toEqual([...m2[j]])
        }
      }
    }
  })

  it('matrixCompMult', () => {

  })

  it('determinant', () => {})

  it('inverse', () => {
    expect(matrixToArray(inverse(mat3(vec3(2, 5, 7), vec3(6, 3, 4), vec3(5, -2, -3))))).toEqual([
      1, -1, 1, -38, 41, -34, 27, -29, 24,
    ])
  })
})
