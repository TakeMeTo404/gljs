import { describe, it, expect } from 'vitest'
import { Vec2, vec2, vec3, vec4 } from '../dist'

describe('vec', () => {
  it('create vec2', () => {
    const x = Math.random()
    const y = Math.random()
    expect([...vec2(x)]).toEqual([x, x])
    expect([...vec2(x, y)]).toEqual([x, y])
    expect([...vec2(vec2(y, x))]).toEqual([y, x])

    expect([...vec2(...[x, y])]).toEqual([x, y])

    expect(() => vec2(...[7, -7])).not.toThrow()
    expect(() => vec2(...([7, -7, 9] as number[]))).toThrow()

    expect(() => vec2(...([vec2(7, 9)] as (number | Vec2)[]))).not.toThrow()

    expect(() => vec2(...([vec2(7, 9), -5] as (number | Vec2)[]))).toThrow()

    // @ts-expect-error
    expect(() => vec2()).toThrowError('Cannot create Vec2')
    // @ts-expect-error
    expect(() => vec2([1, 2])).toThrowError()
    // @ts-expect-error
    expect(() => vec2(2, 3, 4)).toThrowError('Cannot create Vec2')
    // @ts-expect-error
    expect(() => vec2(vec3(1))).toThrowError('Cannot create Vec2')
    // @ts-expect-error
    expect(() => vec2(vec2(1), 1)).toThrowError('Cannot create Vec2')
    // @ts-expect-error
    expect(() => vec2(vec2(1), null)).toThrowError()
  })

  it('create vec3', () => {
    const [x, y, z] = [Math.random(), Math.random(), Math.random()]

    expect([...vec3(x)]).toEqual([x, x, x])
    expect([...vec3(x, y, z)]).toEqual([x, y, z])

    expect([...vec3(vec3(x, y, z))]).toEqual([x, y, z])
    expect([...vec3(vec2(x, y), z)]).toEqual([x, y, z])
    expect([...vec3(x, vec2(y, z))]).toEqual([x, y, z])
  })

  it('create vec4', () => {
    const [x, y, z, w] = [Math.random(), Math.random(), Math.random(), Math.random()]

    expect([...vec4(x)]).toEqual([x, x, x, x])
    expect([...vec4(x, y, z, w)]).toEqual([x, y, z, w])

    expect([...vec4(vec4(x, y, z, w))]).toEqual([x, y, z, w])

    expect([...vec4(vec3(x, y, z), w)]).toEqual([x, y, z, w])
    expect([...vec4(x, vec3(y, z, w))]).toEqual([x, y, z, w])

    expect([...vec4(vec2(x, y), z, w)]).toEqual([x, y, z, w])
    expect([...vec4(x, vec2(y, z), w)]).toEqual([x, y, z, w])
    expect([...vec4(x, y, vec2(z, w))]).toEqual([x, y, z, w])

    expect([...vec4(vec2(x, y), vec2(z, w))]).toEqual([x, y, z, w])
  })

  it('index properties', () => {
    expect(vec2(7)).toHaveProperty([0], 7)
    expect(vec2(-11)).toHaveProperty([1], -11)
    expect(vec2(6)).not.toHaveProperty([2])
    expect(vec2(6)).not.toHaveProperty([3])

    expect(vec3(7)).toHaveProperty([0], 7)
    expect(vec3(-11)).toHaveProperty([1], -11)
    expect(vec3(6)).toHaveProperty([2], 6)
    expect(vec3(0)).not.toHaveProperty([3])

    expect(vec4(7)).toHaveProperty([0], 7)
    expect(vec4(-11)).toHaveProperty([1], -11)
    expect(vec4(6)).toHaveProperty([2], 6)
    expect(vec4(10)).toHaveProperty([3], 10)
  })

  it('get selection', () => {
    const [x, y, z, w] = [Math.random(), Math.random(), Math.random(), Math.random()]
    const [r, g, b, a] = [x, y, z, w]

    expect(vec2(x, y).get('x')).toBe(x)
    expect(vec2(x, y).get('y')).toBe(y)
    // @ts-expect-error
    expect(vec2(x, y).get('z')).toBeUndefined()
    expect(vec2(x, y).get('r')).toBe(r)
    expect(vec2(x, y).get('g')).toBe(g)
    // @ts-expect-error
    expect(vec2(x, y).get('b')).toBeUndefined()

    expect(vec3(x, y, z).get('x')).toBe(x)
    expect(vec3(x, y, z).get('y')).toBe(y)
    expect(vec3(x, y, z).get('z')).toBe(z)
    // @ts-expect-error
    expect(vec3(x, y, z).get('w')).toBeUndefined()
    expect(vec3(x, y, z).get('r')).toBe(r)
    expect(vec3(x, y, z).get('g')).toBe(g)
    expect(vec3(x, y, z).get('b')).toBe(b)
    // @ts-expect-error
    expect(vec3(x, y, z).get('a')).toBeUndefined()

    expect(vec4(x, y, z, w).get('x')).toBe(x)
    expect(vec4(x, y, z, w).get('y')).toBe(y)
    expect(vec4(x, y, z, w).get('z')).toBe(z)
    expect(vec4(x, y, z, w).get('w')).toBe(w)
    expect(vec4(x, y, z, w).get('r')).toBe(r)
    expect(vec4(x, y, z, w).get('g')).toBe(g)
    expect(vec4(x, y, z, w).get('b')).toBe(b)
    expect(vec4(x, y, z, w).get('a')).toBe(a)

    expect([...vec2(x, y).get('yx')]).toEqual([y, x])
    expect([...vec2(x, y).get('rg')]).toEqual([r, g])
    expect([...vec2(x, y).get('ggg')]).toEqual([g, g, g])
    expect([...vec2(x, y).get('xyyx')]).toEqual([x, y, y, x])

    // @ts-expect-error
    expect([...vec2(x, y).get('zz')]).toEqual([undefined, undefined])
    // @ts-expect-error
    expect([...vec2(x, y).get('ww')]).toEqual([undefined, undefined])

    expect([...vec3(x, y, z).get('zz')]).toEqual([z, z])
    // @ts-expect-error
    expect([...vec3(x, y, z).get('ww')]).toEqual([undefined, undefined])

    expect([...vec4(x, y, z, w).get('zz')]).toEqual([z, z])
    expect([...vec4(x, y, z, w).get('ww')]).toEqual([w, w])
  })

  it('vec2.set', () => {
    const [x, y, z, w] = [Math.random(), Math.random(), Math.random(), Math.random()]
    const [r, g, b, a] = [x, y, z, w]

    const v2 = vec2(0)
    expect([...v2]).toEqual([0, 0])

    v2.set('x', x)
    expect([...v2]).toEqual([x, 0])

    v2.set('y', y)
    expect([...v2]).toEqual([x, y])

    v2.set('yx', vec2(z))
    expect([...v2]).toEqual([z, z])

    v2.set('yx', vec2(-5, 10))
    expect([...v2]).toEqual([10, -5])

    v2.set('gr', vec2(g, r))
    expect([...v2]).toEqual([r, g])
  })

  it('vec3.set', () => {
    const [x, y, z, w] = [Math.random(), Math.random(), Math.random(), Math.random()]
    const [r, g, b, a] = [x, y, z, w]

    const v3 = vec3(0)
    expect([...v3]).toEqual([0, 0, 0])

    v3.set('zx', vec2(z, x))
    expect([...v3]).toEqual([x, 0, z])

    v3.set('y', y)
    expect([...v3]).toEqual([x, y, z])

    v3.set('rgb', vec3(r, g, b))
    expect([...v3]).toEqual([r, g, b])
  })

  it('vec4.set', () => {
    const [x, y, z, w] = [Math.random(), Math.random(), Math.random(), Math.random()]
    const [r, g, b, a] = [x, y, z, w]

    const v4 = vec4(0)
    expect([...v4]).toEqual([0, 0, 0, 0])

    v4.set('wxy', vec3(w, x, y))
    expect([...v4]).toEqual([x, y, 0, w])

    v4.set('z', z)
    expect([...v4]).toEqual([x, y, z, w])

    v4.set('a', a)
    v4.set('rgb', vec3(0))
    expect([...v4]).toEqual([0, 0, 0, a])
    v4.set('brg', vec3(b, r, g))
    expect([...v4]).toEqual([r, g, b, a])
  })

  it('callable vector operations', () => {
    expect([...vec2(0)('+', 3)]).toEqual([3, 3])
    expect([...vec2(11, 17)('-', 22)]).toEqual([-11, -5])

    expect([...vec3(1, 1, 2)('*', vec3(2, -2, -2))]).toEqual([2, -2, -4])
    expect([...vec4(10)('/', 10)('+', vec4(5))]).toEqual([6, 6, 6, 6])
  })

  it('callable vector assign operations', () => {
    const v2 = vec2(0)

    expect(v2('+=', 10)).toBeUndefined()
    expect([...v2]).toEqual([10, 10])

    v2('-=', vec2(5, 15))
    expect([...v2]).toEqual([5, -5])

    const v3 = vec3(12, 24, 0)
    v3('/=', 3)
    expect([...v3]).toEqual([4, 8, 0])

    const v4 = vec4(v3, 0)

    v4('*=', 5)
    expect([...v4]).toEqual([20, 40, 0, 0])
    v4('+=', -10)
    expect([...v4]).toEqual([10, 30, -10, -10])
  })
})
