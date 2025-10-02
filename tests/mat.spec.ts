import { describe, it, expect } from 'vitest'
import { mat2, vec2 } from '../dist'

const r = () => Math.random()

describe('mat', () => {
  it('create mat2', () => {
    const row1 = vec2(r(), r())
    const row2 = vec2(r(), r())

    let m = mat2(row1, row2)
    expect(m[0][0]).toEqual(row1[0])
    expect(m[0][1]).toEqual(row1[1])
    expect(m[1][0]).toEqual(row2[0])
    expect(m[1][1]).toEqual(row2[1])

    m = mat2(7)
    expect(m[0][0]).toEqual(7)
    expect(m[0][1]).toEqual(0)
    expect(m[1][0]).toEqual(0)
    expect(m[1][1]).toEqual(7)

    m = mat2([10, -5], [-2, 14])
    expect(m[0][0]).toEqual(10)
    expect(m[0][1]).toEqual(-5)
    expect(m[1][0]).toEqual(-2)
    expect(m[1][1]).toEqual(14)
  })
})

// mat2(1) ✅
// mat2(...number[]) ✅
// mat2(1, 2, 3, 4) ⛔️
