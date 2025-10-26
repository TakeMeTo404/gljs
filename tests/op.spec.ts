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
  determinant,
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
  mat2,
  mat2x3,
  mat2x4,
  mat3,
  mat3x2,
  mat4,
  mat4x3,
  matrixCompMult,
  max,
  min,
  mix,
  mod,
  normalize,
  outerProduct,
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

    const _exp = exp as any
    expect(() => _exp()).toThrow(`Invalid 'exp' operator args`)
    expect(() => _exp('0')).toThrow(`Invalid 'exp' operator args`)
    expect(() => _exp({})).toThrow(`Invalid 'exp' operator args`)
    expect(() => _exp(function () {})).toThrow(`Invalid 'exp' operator args`)
    expect(() => _exp(mat2x4(1))).toThrow(`Invalid 'exp' operator args`)
    expect(() => _exp([1])).toThrow(`Invalid 'exp' operator args`)
  })

  it('sqrt', () => {
    expect(sqrt(4)).toBe(2)
    expect(sqrt(9)).toBe(3)
    expect([...sqrt(vec2(4, 16))]).toEqual([2, 4])
    expect([...sqrt(vec3(9, 25, 100))]).toEqual([3, 5, 10])

    const _sqrt = sqrt as any
    expect(() => _sqrt()).toThrow(`Invalid 'sqrt' operator args`)
    expect(() => _sqrt('0')).toThrow(`Invalid 'sqrt' operator args`)
    expect(() => _sqrt({})).toThrow(`Invalid 'sqrt' operator args`)
    expect(() => _sqrt(function () {})).toThrow(`Invalid 'sqrt' operator args`)
    expect(() => _sqrt(mat2x4(1))).toThrow(`Invalid 'sqrt' operator args`)
    expect(() => _sqrt([1])).toThrow(`Invalid 'sqrt' operator args`)
  })

  it('inversesqrt', () => {
    expect(inversesqrt(4)).toBe(0.5)
    expect(inversesqrt(16)).toBe(0.25)
    expect([...inversesqrt(vec2(4, 16))]).toEqual([0.5, 0.25])

    const _inversesqrt = inversesqrt as any
    expect(() => _inversesqrt()).toThrow(`Invalid 'inversesqrt' operator args`)
    expect(() => _inversesqrt('0')).toThrow(`Invalid 'inversesqrt' operator args`)
    expect(() => _inversesqrt({})).toThrow(`Invalid 'inversesqrt' operator args`)
    expect(() => _inversesqrt(function () {})).toThrow(`Invalid 'inversesqrt' operator args`)
    expect(() => _inversesqrt(mat2x4(1))).toThrow(`Invalid 'inversesqrt' operator args`)
    expect(() => _inversesqrt([1])).toThrow(`Invalid 'inversesqrt' operator args`)
  })

  it('log', () => {
    expect(log(1)).toBe(0)
    expect(log(Math.E)).toBeCloseTo(1)
    expect([...log(vec2(1, Math.E))]).toEqual([0, 1])

    const _log = log as any
    expect(() => _log()).toThrow(`Invalid 'log' operator args`)
    expect(() => _log('0')).toThrow(`Invalid 'log' operator args`)
    expect(() => _log({})).toThrow(`Invalid 'log' operator args`)
    expect(() => _log(function () {})).toThrow(`Invalid 'log' operator args`)
    expect(() => _log(mat2x4(1))).toThrow(`Invalid 'log' operator args`)
    expect(() => _log([1])).toThrow(`Invalid 'log' operator args`)
  })

  it('exp2', () => {
    expect(exp2(0)).toBe(1)
    expect(exp2(3)).toBe(8)
    expect([...exp2(vec2(0, 3))]).toEqual([1, 8])

    const _exp2 = exp2 as any
    expect(() => _exp2()).toThrow(`Invalid 'exp2' operator args`)
    expect(() => _exp2('0')).toThrow(`Invalid 'exp2' operator args`)
    expect(() => _exp2({})).toThrow(`Invalid 'exp2' operator args`)
    expect(() => _exp2(function () {})).toThrow(`Invalid 'exp2' operator args`)
    expect(() => _exp2(mat2x4(1))).toThrow(`Invalid 'exp2' operator args`)
    expect(() => _exp2([1])).toThrow(`Invalid 'exp2' operator args`)
  })

  it('log2', () => {
    expect(log2(1)).toBe(0)
    expect(log2(8)).toBe(3)
    expect([...log2(vec2(1, 8))]).toEqual([0, 3])

    const _log2 = log2 as any
    expect(() => _log2()).toThrow(`Invalid 'log2' operator args`)
    expect(() => _log2('0')).toThrow(`Invalid 'log2' operator args`)
    expect(() => _log2({})).toThrow(`Invalid 'log2' operator args`)
    expect(() => _log2(function () {})).toThrow(`Invalid 'log2' operator args`)
    expect(() => _log2(mat2x4(1))).toThrow(`Invalid 'log2' operator args`)
    expect(() => _log2([1])).toThrow(`Invalid 'log2' operator args`)
  })

  it('abs', () => {
    expect(abs(-5)).toBe(5)
    expect(abs(5)).toBe(5)
    expect([...abs(vec2(-1, 2))]).toEqual([1, 2])
    expect([...abs(vec3(-1, -2, 3))]).toEqual([1, 2, 3])

    const _abs = abs as any
    expect(() => _abs()).toThrow(`Invalid 'abs' operator args`)
    expect(() => _abs('0')).toThrow(`Invalid 'abs' operator args`)
    expect(() => _abs({})).toThrow(`Invalid 'abs' operator args`)
    expect(() => _abs(function () {})).toThrow(`Invalid 'abs' operator args`)
    expect(() => _abs(mat2x4(1))).toThrow(`Invalid 'abs' operator args`)
    expect(() => _abs([1])).toThrow(`Invalid 'abs' operator args`)
  })

  it('sign', () => {
    expect(sign(-5)).toBe(-1)
    expect(sign(5)).toBe(1)
    expect(sign(0)).toBe(0)
    expect([...sign(vec2(-2, 3))]).toEqual([-1, 1])

    const _sign = sign as any
    expect(() => _sign()).toThrow(`Invalid 'sign' operator args`)
    expect(() => _sign('0')).toThrow(`Invalid 'sign' operator args`)
    expect(() => _sign({})).toThrow(`Invalid 'sign' operator args`)
    expect(() => _sign(function () {})).toThrow(`Invalid 'sign' operator args`)
    expect(() => _sign(mat2x4(1))).toThrow(`Invalid 'sign' operator args`)
    expect(() => _sign([1])).toThrow(`Invalid 'sign' operator args`)
  })

  it('floor', () => {
    expect(floor(2.7)).toBe(2)
    expect(floor(-2.7)).toBe(-3)
    expect([...floor(vec2(2.7, -2.7))]).toEqual([2, -3])

    const _floor = floor as any
    expect(() => _floor()).toThrow(`Invalid 'floor' operator args`)
    expect(() => _floor('0')).toThrow(`Invalid 'floor' operator args`)
    expect(() => _floor({})).toThrow(`Invalid 'floor' operator args`)
    expect(() => _floor(function () {})).toThrow(`Invalid 'floor' operator args`)
    expect(() => _floor(mat2x4(1))).toThrow(`Invalid 'floor' operator args`)
    expect(() => _floor([1])).toThrow(`Invalid 'floor' operator args`)
  })

  it('ceil', () => {
    expect(ceil(2.3)).toBe(3)
    expect(ceil(-2.3)).toBe(-2)
    expect([...ceil(vec2(2.3, -2.3))]).toEqual([3, -2])

    const _ceil = ceil as any
    expect(() => _ceil()).toThrow(`Invalid 'ceil' operator args`)
    expect(() => _ceil('0')).toThrow(`Invalid 'ceil' operator args`)
    expect(() => _ceil({})).toThrow(`Invalid 'ceil' operator args`)
    expect(() => _ceil(function () {})).toThrow(`Invalid 'ceil' operator args`)
    expect(() => _ceil(mat2x4(1))).toThrow(`Invalid 'ceil' operator args`)
    expect(() => _ceil([1])).toThrow(`Invalid 'ceil' operator args`)
  })

  it('round', () => {
    expect(round(2.3)).toBe(2)
    expect(round(2.7)).toBe(3)
    expect([...round(vec2(2.3, 2.7))]).toEqual([2, 3])

    const _round = round as any
    expect(() => _round()).toThrow(`Invalid 'round' operator args`)
    expect(() => _round('0')).toThrow(`Invalid 'round' operator args`)
    expect(() => _round({})).toThrow(`Invalid 'round' operator args`)
    expect(() => _round(function () {})).toThrow(`Invalid 'round' operator args`)
    expect(() => _round(mat2x4(1))).toThrow(`Invalid 'round' operator args`)
    expect(() => _round([1])).toThrow(`Invalid 'round' operator args`)
  })

  it('fract', () => {
    expect(fract(2.7)).toBeCloseTo(0.7)
    expect(fract(-2.7)).toBeCloseTo(0.3) // -2.7 - (-3) = 0.3
    expect([...fract(vec2(2.7, -2.7))]).toEqual([expect.closeTo(0.7), expect.closeTo(0.3)])

    const _fract = fract as any
    expect(() => _fract()).toThrow(`Invalid 'fract' operator args`)
    expect(() => _fract('0')).toThrow(`Invalid 'fract' operator args`)
    expect(() => _fract({})).toThrow(`Invalid 'fract' operator args`)
    expect(() => _fract(function () {})).toThrow(`Invalid 'fract' operator args`)
    expect(() => _fract(mat2x4(1))).toThrow(`Invalid 'fract' operator args`)
    expect(() => _fract([1])).toThrow(`Invalid 'fract' operator args`)
  })

  it('trunc', () => {
    expect(trunc(2.7)).toBe(2)
    expect(trunc(-2.7)).toBe(-2)
    expect([...trunc(vec2(2.7, -2.7))]).toEqual([2, -2])

    const _trunc = trunc as any
    expect(() => _trunc()).toThrow(`Invalid 'trunc' operator args`)
    expect(() => _trunc('0')).toThrow(`Invalid 'trunc' operator args`)
    expect(() => _trunc({})).toThrow(`Invalid 'trunc' operator args`)
    expect(() => _trunc(function () {})).toThrow(`Invalid 'trunc' operator args`)
    expect(() => _trunc(mat2x4(1))).toThrow(`Invalid 'trunc' operator args`)
    expect(() => _trunc([1])).toThrow(`Invalid 'trunc' operator args`)
  })

  it('sin', () => {
    expect(sin(0)).toBe(0)
    expect(sin(Math.PI / 2)).toBeCloseTo(1)
    expect([...sin(vec2(0, Math.PI / 2))]).toEqual([0, 1])

    const _sin = sin as any
    expect(() => _sin()).toThrow(`Invalid 'sin' operator args`)
    expect(() => _sin('0')).toThrow(`Invalid 'sin' operator args`)
    expect(() => _sin({})).toThrow(`Invalid 'sin' operator args`)
    expect(() => _sin(function () {})).toThrow(`Invalid 'sin' operator args`)
    expect(() => _sin(mat2x4(1))).toThrow(`Invalid 'sin' operator args`)
    expect(() => _sin([1])).toThrow(`Invalid 'sin' operator args`)
  })

  it('cos', () => {
    expect(cos(0)).toBe(1)
    expect(cos(Math.PI)).toBeCloseTo(-1)
    expect([...cos(vec2(0, Math.PI))]).toEqual([1, -1])

    const _cos = cos as any
    expect(() => _cos()).toThrow(`Invalid 'cos' operator args`)
    expect(() => _cos('0')).toThrow(`Invalid 'cos' operator args`)
    expect(() => _cos({})).toThrow(`Invalid 'cos' operator args`)
    expect(() => _cos(function () {})).toThrow(`Invalid 'cos' operator args`)
    expect(() => _cos(mat2x4(1))).toThrow(`Invalid 'cos' operator args`)
    expect(() => _cos([1])).toThrow(`Invalid 'cos' operator args`)
  })

  it('tan', () => {
    expect(tan(0)).toBe(0)
    expect(tan(Math.PI / 4)).toBeCloseTo(1)
    expect(tan(vec2(0, Math.PI / 4))[0]).toBe(0)
    expect(tan(vec2(0, Math.PI / 4))[1]).toBeCloseTo(1)

    const _tan = tan as any
    expect(() => _tan()).toThrow(`Invalid 'tan' operator args`)
    expect(() => _tan('0')).toThrow(`Invalid 'tan' operator args`)
    expect(() => _tan({})).toThrow(`Invalid 'tan' operator args`)
    expect(() => _tan(function () {})).toThrow(`Invalid 'tan' operator args`)
    expect(() => _tan(mat2x4(1))).toThrow(`Invalid 'tan' operator args`)
    expect(() => _tan([1])).toThrow(`Invalid 'tan' operator args`)
  })

  it('asin', () => {
    expect(asin(0)).toBe(0)
    expect(asin(1)).toBeCloseTo(Math.PI / 2)
    expect([...asin(vec2(0, 1))]).toEqual([0, Math.PI / 2])

    const _asin = asin as any
    expect(() => _asin()).toThrow(`Invalid 'asin' operator args`)
    expect(() => _asin('0')).toThrow(`Invalid 'asin' operator args`)
    expect(() => _asin({})).toThrow(`Invalid 'asin' operator args`)
    expect(() => _asin(function () {})).toThrow(`Invalid 'asin' operator args`)
    expect(() => _asin(mat2x4(1))).toThrow(`Invalid 'asin' operator args`)
    expect(() => _asin([1])).toThrow(`Invalid 'asin' operator args`)
  })

  it('acos', () => {
    expect(acos(1)).toBe(0)
    expect(acos(0)).toBeCloseTo(Math.PI / 2)
    expect([...acos(vec2(1, 0))]).toEqual([0, Math.PI / 2])

    const _acos = acos as any
    expect(() => _acos()).toThrow(`Invalid 'acos' operator args`)
    expect(() => _acos('0')).toThrow(`Invalid 'acos' operator args`)
    expect(() => _acos({})).toThrow(`Invalid 'acos' operator args`)
    expect(() => _acos(function () {})).toThrow(`Invalid 'acos' operator args`)
    expect(() => _acos(mat2x4(1))).toThrow(`Invalid 'acos' operator args`)
    expect(() => _acos([1])).toThrow(`Invalid 'acos' operator args`)
  })

  it('atan', () => {
    expect(atan(0)).toBe(0)
    expect(atan(1)).toBeCloseTo(Math.PI / 4)
    expect([...atan(vec2(0, 1))]).toEqual([0, Math.PI / 4])

    const _atan = atan as any
    expect(() => _atan()).toThrow(`Invalid 'atan' operator args`)
    expect(() => _atan('0')).toThrow(`Invalid 'atan' operator args`)
    expect(() => _atan({})).toThrow(`Invalid 'atan' operator args`)
    expect(() => _atan(function () {})).toThrow(`Invalid 'atan' operator args`)
    expect(() => _atan(mat2x4(1))).toThrow(`Invalid 'atan' operator args`)
    expect(() => _atan([1])).toThrow(`Invalid 'atan' operator args`)
  })

  it('sinh', () => {
    expect(sinh(0)).toBe(0)
    expect(sinh(1)).toBeCloseTo(Math.sinh(1))
    expect([...sinh(vec2(0, 1))]).toEqual([0, Math.sinh(1)])

    const _sinh = sinh as any
    expect(() => _sinh()).toThrow(`Invalid 'sinh' operator args`)
    expect(() => _sinh('0')).toThrow(`Invalid 'sinh' operator args`)
    expect(() => _sinh({})).toThrow(`Invalid 'sinh' operator args`)
    expect(() => _sinh(function () {})).toThrow(`Invalid 'sinh' operator args`)
    expect(() => _sinh(mat2x4(1))).toThrow(`Invalid 'sinh' operator args`)
    expect(() => _sinh([1])).toThrow(`Invalid 'sinh' operator args`)
  })

  it('cosh', () => {
    expect(cosh(0)).toBe(1)
    expect(cosh(1)).toBeCloseTo(Math.cosh(1))
    expect([...cosh(vec2(0, 1))]).toEqual([1, Math.cosh(1)])

    const _cosh = cosh as any
    expect(() => _cosh()).toThrow(`Invalid 'cosh' operator args`)
    expect(() => _cosh('0')).toThrow(`Invalid 'cosh' operator args`)
    expect(() => _cosh({})).toThrow(`Invalid 'cosh' operator args`)
    expect(() => _cosh(function () {})).toThrow(`Invalid 'cosh' operator args`)
    expect(() => _cosh(mat2x4(1))).toThrow(`Invalid 'cosh' operator args`)
    expect(() => _cosh([1])).toThrow(`Invalid 'cosh' operator args`)
  })

  it('tanh', () => {
    expect(tanh(0)).toBe(0)
    expect(tanh(1)).toBeCloseTo(Math.tanh(1))
    expect([...tanh(vec2(0, 1))]).toEqual([0, Math.tanh(1)])

    const _tanh = tanh as any
    expect(() => _tanh()).toThrow(`Invalid 'tanh' operator args`)
    expect(() => _tanh('0')).toThrow(`Invalid 'tanh' operator args`)
    expect(() => _tanh({})).toThrow(`Invalid 'tanh' operator args`)
    expect(() => _tanh(function () {})).toThrow(`Invalid 'tanh' operator args`)
    expect(() => _tanh(mat2x4(1))).toThrow(`Invalid 'tanh' operator args`)
    expect(() => _tanh([1])).toThrow(`Invalid 'tanh' operator args`)
  })

  it('asinh', () => {
    expect(asinh(0)).toBe(0)
    expect(asinh(1)).toBeCloseTo(Math.asinh(1))
    expect([...asinh(vec2(0, 1))]).toEqual([0, Math.asinh(1)])

    const _asinh = asinh as any
    expect(() => _asinh()).toThrow(`Invalid 'asinh' operator args`)
    expect(() => _asinh('0')).toThrow(`Invalid 'asinh' operator args`)
    expect(() => _asinh({})).toThrow(`Invalid 'asinh' operator args`)
    expect(() => _asinh(function () {})).toThrow(`Invalid 'asinh' operator args`)
    expect(() => _asinh(mat2x4(1))).toThrow(`Invalid 'asinh' operator args`)
    expect(() => _asinh([1])).toThrow(`Invalid 'asinh' operator args`)
  })

  it('acosh', () => {
    expect(acosh(1)).toBe(0)
    expect(acosh(2)).toBeCloseTo(Math.acosh(2))
    expect([...acosh(vec2(1, 2))]).toEqual([0, Math.acosh(2)])

    const _acosh = acosh as any
    expect(() => _acosh()).toThrow(`Invalid 'acosh' operator args`)
    expect(() => _acosh('0')).toThrow(`Invalid 'acosh' operator args`)
    expect(() => _acosh({})).toThrow(`Invalid 'acosh' operator args`)
    expect(() => _acosh(function () {})).toThrow(`Invalid 'acosh' operator args`)
    expect(() => _acosh(mat2x4(1))).toThrow(`Invalid 'acosh' operator args`)
    expect(() => _acosh([1])).toThrow(`Invalid 'acosh' operator args`)
  })

  it('atanh', () => {
    expect(atanh(0)).toBe(0)
    expect(atanh(0.5)).toBeCloseTo(Math.atanh(0.5))
    expect([...atanh(vec2(0, 0.5))]).toEqual([0, Math.atanh(0.5)])

    const _atanh = atanh as any
    expect(() => _atanh()).toThrow(`Invalid 'atanh' operator args`)
    expect(() => _atanh('0')).toThrow(`Invalid 'atanh' operator args`)
    expect(() => _atanh({})).toThrow(`Invalid 'atanh' operator args`)
    expect(() => _atanh(function () {})).toThrow(`Invalid 'atanh' operator args`)
    expect(() => _atanh(mat2x4(1))).toThrow(`Invalid 'atanh' operator args`)
    expect(() => _atanh([1])).toThrow(`Invalid 'atanh' operator args`)
  })

  it('degrees', () => {
    expect(degrees(Math.PI)).toBe(180)
    expect(degrees(Math.PI / 2)).toBe(90)
    expect([...degrees(vec2(Math.PI, Math.PI / 2))]).toEqual([180, 90])

    const _degrees = degrees as any
    expect(() => _degrees()).toThrow(`Invalid 'degrees' operator args`)
    expect(() => _degrees('0')).toThrow(`Invalid 'degrees' operator args`)
    expect(() => _degrees({})).toThrow(`Invalid 'degrees' operator args`)
    expect(() => _degrees(function () {})).toThrow(`Invalid 'degrees' operator args`)
    expect(() => _degrees(mat2x4(1))).toThrow(`Invalid 'degrees' operator args`)
    expect(() => _degrees([1])).toThrow(`Invalid 'degrees' operator args`)
  })

  it('radians', () => {
    expect(radians(180)).toBeCloseTo(Math.PI)
    expect(radians(90)).toBeCloseTo(Math.PI / 2)
    expect([...radians(vec2(180, 90))]).toEqual([Math.PI, Math.PI / 2])

    const _radians = radians as any
    expect(() => _radians()).toThrow(`Invalid 'radians' operator args`)
    expect(() => _radians('0')).toThrow(`Invalid 'radians' operator args`)
    expect(() => _radians({})).toThrow(`Invalid 'radians' operator args`)
    expect(() => _radians(function () {})).toThrow(`Invalid 'radians' operator args`)
    expect(() => _radians(mat2x4(1))).toThrow(`Invalid 'radians' operator args`)
    expect(() => _radians([1])).toThrow(`Invalid 'radians' operator args`)
  })

  it('pow', () => {
    expect(pow(2, 5)).toBe(32)
    expect(pow(4, 0.5)).toBe(2)
    expect(pow(5, 0)).toBe(1)
    expect([...pow(vec2(2, 3), vec2(3, 2))]).toEqual([8, 9])
    expect([...pow(vec3(2, 3, 4), 2)]).toEqual([4, 9, 16])
    expect([...pow(vec4(2, 3, 4, 5), -1)]).toEqual([1 / 2, 1 / 3, 1 / 4, 1 / 5])

    const _pow = pow as any
    expect(() => _pow()).toThrow(`Invalid 'pow' operator args`)
    expect(() => _pow(1)).toThrow(`Invalid 'pow' operator args`)
    expect(() => _pow(vec3(1))).toThrow(`Invalid 'pow' operator args`)
    expect(() => _pow(2, vec2(1))).toThrow(`Invalid 'pow' operator args`)
    expect(() => _pow(vec3(1), vec2(1))).toThrow(`Invalid 'pow' operator args`)
  })

  it('min', () => {
    expect(min(2, 5)).toBe(2)
    expect(min(4, 0.5)).toBe(0.5)
    expect(min(5, 0)).toBe(0)
    expect([...min(vec2(2, 3), vec2(3, 2))]).toEqual([2, 2])
    expect([...min(vec3(2, 3, 4), 2)]).toEqual([2, 2, 2])
    expect([...min(vec4(2, 3, 4, 5), -1)]).toEqual([-1, -1, -1, -1])

    const _min = min as any
    expect(() => _min()).toThrow(`Invalid 'min' operator args`)
    expect(() => _min(1)).toThrow(`Invalid 'min' operator args`)
    expect(() => _min(vec3(1))).toThrow(`Invalid 'min' operator args`)
    expect(() => _min(2, vec2(1))).toThrow(`Invalid 'min' operator args`)
    expect(() => _min(vec3(1), vec2(1))).toThrow(`Invalid 'min' operator args`)
  })

  it('max', () => {
    expect(max(2, 5)).toBe(5)
    expect(max(4, 0.5)).toBe(4)
    expect(max(5, 0)).toBe(5)
    expect([...max(vec2(2, 3), vec2(3, 2))]).toEqual([3, 3])
    expect([...max(vec3(2, 3, 4), 2)]).toEqual([2, 3, 4])
    expect([...max(vec4(2, 3, 4, 5), -1)]).toEqual([2, 3, 4, 5])

    const _max = max as any
    expect(() => _max()).toThrow(`Invalid 'max' operator args`)
    expect(() => _max(1)).toThrow(`Invalid 'max' operator args`)
    expect(() => _max(vec3(1))).toThrow(`Invalid 'max' operator args`)
    expect(() => _max(2, vec2(1))).toThrow(`Invalid 'max' operator args`)
    expect(() => _max(vec3(1), vec2(1))).toThrow(`Invalid 'max' operator args`)
  })

  it('mod', () => {
    expect(mod(2, 5)).toBe(2)
    expect(mod(4, 0.5)).toBe(0)
    expect(mod(5, 0)).toBe(NaN) // mod by zero returns NaN in JavaScript
    expect([...mod(vec2(2, 3), vec2(3, 2))]).toEqual([2, 1])
    expect([...mod(vec3(2, 3, 4), 2)]).toEqual([0, 1, 0])
    expect([...mod(vec4(2, 3, 4, 5), -1)]).toEqual([0, 0, 0, 0])

    const _mod = mod as any
    expect(() => _mod()).toThrow(`Invalid 'mod' operator args`)
    expect(() => _mod(1)).toThrow(`Invalid 'mod' operator args`)
    expect(() => _mod(vec3(1))).toThrow(`Invalid 'mod' operator args`)
    expect(() => _mod(2, vec2(1))).toThrow(`Invalid 'mod' operator args`)
    expect(() => _mod(vec3(1), vec2(1))).toThrow(`Invalid 'mod' operator args`)
  })

  it('step', () => {
    expect(step(2, 5)).toBe(1)
    expect(step(4, 0.5)).toBe(0)
    expect(step(5, 0)).toBe(0)
    expect([...step(vec2(2, 3), vec2(3, 2))]).toEqual([1, 0])
    expect([...step(vec3(2, 3, 4), 2)]).toEqual([1, 0, 0])
    expect([...step(vec4(2, 3, 4, 5), -1)]).toEqual([0, 0, 0, 0])

    const _step = step as any
    expect(() => _step()).toThrow(`Invalid 'step' operator args`)
    expect(() => _step(1)).toThrow(`Invalid 'step' operator args`)
    expect(() => _step(vec3(1))).toThrow(`Invalid 'step' operator args`)
    expect(() => _step(2, vec2(1))).toThrow(`Invalid 'step' operator args`)
    expect(() => _step(vec3(1), vec2(1))).toThrow(`Invalid 'step' operator args`)
  })

  it('clamp', () => {
    expect(clamp(2, 1, 5)).toBe(2)
    expect(clamp(0, 1, 5)).toBe(1)
    expect(clamp(7, 1, 5)).toBe(5)
    expect([...clamp(vec2(2, 0), vec2(1, 1), vec2(5, 5))]).toEqual([2, 1])
    expect([...clamp(vec3(2, 0, 7), 1, 5)]).toEqual([2, 1, 5])
    expect([...clamp(vec4(2, 0, 7, 3), -1, 4)]).toEqual([2, 0, 4, 3])

    const _clamp = clamp as any
    expect(() => _clamp()).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(1)).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(vec4(1))).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(1, 2)).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(1, 2, '3')).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(vec2(3), 1, vec3(1))).toThrow(`Invalid 'clamp' operator args`)
    expect(() => _clamp(1, 1, vec3(1))).toThrow(`Invalid 'clamp' operator args`)
  })

  it('mix', () => {
    expect(mix(2, 5, 0)).toBe(2)
    expect(mix(2, 5, 1)).toBe(5)
    expect(mix(2, 5, 0.5)).toBe(3.5)
    expect([...mix(vec2(2, 3), vec2(5, 7), vec2(0, 1))]).toEqual([2, 7])
    expect([...mix(vec3(2, 3, 4), 5, 0.5)]).toEqual([3.5, 4, 4.5])
    expect([...mix(vec4(2, 3, 4, 5), -1, 0.5)]).toEqual([0.5, 1, 1.5, 2])

    const _mix = mix as any
    expect(() => _mix()).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(1)).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(vec4(1))).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(1, 2)).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(1, 2, '3')).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(vec2(3), 1, vec3(1))).toThrow(`Invalid 'mix' operator args`)
    expect(() => _mix(1, 1, vec3(1))).toThrow(`Invalid 'mix' operator args`)
  })

  it('smoothstep', () => {
    expect(smoothstep(2, 5, 1)).toBe(0)
    expect(smoothstep(2, 5, 6)).toBe(1)
    expect(smoothstep(2, 5, 3.5)).toBeCloseTo(0.5)
    expect([...smoothstep(vec2(2, 1), vec2(5, 3), vec2(1, 2))]).toEqual([0, 0.5])
    expect([...smoothstep(vec3(-10, 1, 0), 5, -2.5)]).toEqual([0.5, 0, 0])

    const _smoothstep = smoothstep as any
    expect(() => _smoothstep()).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(1)).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(vec4(1))).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(1, 2)).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(1, 2, '3')).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(vec2(3), 1, vec3(1))).toThrow(`Invalid 'smoothstep' operator args`)
    expect(() => _smoothstep(1, 1, vec3(1))).toThrow(`Invalid 'smoothstep' operator args`)
  })

  it('length', () => {
    expect(length(7)).toBe(7)

    expect(length(vec2(3, 4))).toBe(5)
    expect(length(vec3(0, 3, 4))).toBe(5)
    expect(length(vec4(7, -7, -7, 7))).toBe(14)

    const _length = length as any
    expect(() => _length()).toThrow(`Invalid 'length' operator args`)
    expect(() => _length(null)).toThrow(`Invalid 'length' operator args`)
    expect(() => _length(mat2(1))).toThrow(`Invalid 'length' operator args`)
  })

  it('distance', () => {
    expect(distance(5, 7)).toBe(2)
    expect(distance(7, 5)).toBe(2)
    expect(distance(-1, -3)).toBe(2)
    expect(distance(-3, 2)).toBe(5)

    expect(distance(vec2(0), vec2(3, 4))).toBe(5)

    expect(distance(vec3(7, 0, -24), vec3(0, 0, 0))).toBe(25)

    const _distance = distance as any
    expect(() => _distance()).toThrow(`Invalid 'distance' operator args`)
    expect(() => _distance(vec2(1), 1)).toThrow(`Invalid 'distance' operator args`)
    expect(() => _distance(vec4(1), vec3(1))).toThrow(`Invalid 'distance' operator args`)
  })

  it('dot', () => {
    expect(dot(2, 5)).toBe(10)

    expect(dot(vec2(1, 2), vec2(3, 4))).toBe(11)
    expect(dot(vec3(3, 5, 9), vec3(8, 7, -1))).toBe(50)

    const _dot = dot as any
    expect(() => _dot()).toThrow(`Invalid 'dot' operator args`)
    expect(() => _dot(vec2(1), 1)).toThrow(`Invalid 'dot' operator args`)
    expect(() => _dot(vec4(1), vec3(1))).toThrow(`Invalid 'dot' operator args`)
  })

  it('cross', () => {
    expect([...cross(vec3(1, 2, 3), vec3(4, 5, 6))]).toEqual([-3, 6, -3])

    const _cross = cross as any
    expect(() => _cross()).toThrow(`Invalid 'cross' operator args`)
    expect(() => _cross(undefined)).toThrow(`Invalid 'cross' operator args`)
    expect(() => _cross(vec2(1))).toThrow(`Invalid 'cross' operator args`)
    expect(() => _cross(vec2(1), vec3(1))).toThrow(`Invalid 'cross' operator args`)
    expect(() => _cross(vec4(1), vec4(1))).toThrow(`Invalid 'cross' operator args`)
  })

  it('normalize', () => {
    expect(normalize(Math.random() * 100)).toBe(1)

    expect([...normalize(vec2(7, 0))]).toEqual([1, 0])
    expect([...normalize(vec3(0, 0, -5))]).toEqual([0, 0, -1])

    expect([...normalize(vec2(3, -4))]).toEqual([3 / 5, -4 / 5])

    const _normalize = normalize as any
    expect(() => _normalize()).toThrow(`Invalid 'normalize' operator args`)
    expect(() => _normalize(null)).toThrow(`Invalid 'normalize' operator args`)
    expect(() => _normalize(mat2(1))).toThrow(`Invalid 'normalize' operator args`)
  })

  it('faceforward', () => {})

  it('reflect', () => {})

  it('refract', () => {})

  it('outerProduct', () => {
    const m2 = outerProduct(vec2(1, 2), vec2(3, 4))
    expect([...m2[0]]).toEqual([3, 4])
    expect([...m2[1]]).toEqual([6, 8])

    const m3x2 = outerProduct(vec3(2, 4, 6), vec2(5, 10))
    expect([...m3x2.columns[0]]).toEqual([10, 20, 30])
    expect([...m3x2.columns[1]]).toEqual([20, 40, 60])

    expect(matrixToArray(outerProduct(vec4(-1), vec4(-1)))).toEqual(times(16, () => 1))

    const _outerProduct = outerProduct as any
    expect(() => _outerProduct()).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(1, 2)).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(vec2(1))).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(vec2(1), 1)).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(vec4(1), mat2(1))).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct({}, vec2(1))).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(null)).toThrow(`Invalid 'outerProduct' operator args`)
    expect(() => _outerProduct(undefined)).toThrow(`Invalid 'outerProduct' operator args`)
  })

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

    const _transpose = transpose as any
    expect(() => _transpose()).toThrow(`Invalid 'transpose' operator args`)
    expect(() => _transpose(vec2(1))).toThrow(`Invalid 'transpose' operator args`)
    expect(() => _transpose([mat2(1)])).toThrow(`Invalid 'transpose' operator args`)
    expect(() => _transpose(null)).toThrow(`Invalid 'transpose' operator args`)
    expect(() => _transpose(undefined)).toThrow(`Invalid 'transpose' operator args`)
  })

  it('matrixCompMult', () => {
    const m = matrixCompMult(mat2x3(1, 2, 3, 4, 5, 6), mat2x3(2, 4, 6, 8, 10, 12))
    expect([...m[0]]).toEqual([2, 8, 18])
    expect([...m[1]]).toEqual([32, 50, 72])

    const _matrixCompMult = matrixCompMult as any
    expect(() => _matrixCompMult()).toThrow(`Invalid 'matrixCompMult' operator args`)
    expect(() => _matrixCompMult(mat2(1))).toThrow(`Invalid 'matrixCompMult' operator args`)
    expect(() => _matrixCompMult([mat2(1), mat2(1)])).toThrow(
      `Invalid 'matrixCompMult' operator args`,
    )
    expect(() => _matrixCompMult(mat2(1), mat2x3(1))).toThrow(
      `Invalid 'matrixCompMult' operator args`,
    )
    expect(() => _matrixCompMult(undefined)).toThrow(`Invalid 'matrixCompMult' operator args`)
    expect(() => _matrixCompMult(mat2(1), null)).toThrow(`Invalid 'matrixCompMult' operator args`)
  })

  it('determinant', () => {
    expect(determinant(mat2(1, 2, 3, 4))).toBe(-2)
    expect(determinant(mat3(1, 2, 3, 4, 5, 6, 7, 8, 9))).toBe(0)
    expect(determinant(mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16))).toBe(0)

    expect(determinant(mat2(vec2(1)))).toBe(1)
    expect(determinant(mat3(vec3(1)))).toBe(1)
    expect(determinant(mat4(vec4(1)))).toBe(1)

    const _determinant = determinant as any
    expect(() => _determinant(undefined)).toThrow(`Invalid 'determinant' operator args`)
    expect(() => _determinant(vec2(1))).toThrow(`Invalid 'determinant' operator args`)
    expect(() => _determinant('')).toThrow(`Invalid 'determinant' operator args`)
    expect(() => _determinant(function () {})).toThrow(`Invalid 'determinant' operator args`)
    expect(() => _determinant(1)).toThrow(`Invalid 'determinant' operator args`)

    expect(() => _determinant(mat2x3(1))).toThrow(
      `Determinant can only be calculated for square matrices`,
    )
    expect(() => _determinant(mat4x3(1))).toThrow(
      `Determinant can only be calculated for square matrices`,
    )
  })

  it('inverse', () => {
    expect(matrixToArray(inverse(mat3(vec3(2, 5, 7), vec3(6, 3, 4), vec3(5, -2, -3))))).toEqual([
      1, -1, 1, -38, 41, -34, 27, -29, 24,
    ])

    const _inverse = inverse as any
    expect(() => _inverse(undefined)).toThrow(`Invalid 'inverse' operator args`)
    expect(() => _inverse(vec4(1))).toThrow(`Invalid 'inverse' operator args`)
    expect(() => _inverse(mat3x2(0, 0, 0, 0, 0, 0))).toThrow(
      `Inverse matrix can only be calculated for square matrices`,
    )
    expect(() => _inverse(mat2(0, 0, 0, 0))).toThrow(
      `Matrix is singular (determinant is 0), inverse does not exist`,
    )
  })
})
