import type { Vec2, Vec3, Vec4 } from './vec'

export type Vec2CreateArgs =
  | [number]
  | [number, number]
  | [[number, number]]
  | [Record<'x' | 'y', number>]
  | [Record<'r' | 'g', number>]
  | [Vec2]

export type Vec3CreateArgs =
  | [number]
  | [number, number, number]
  | [[number, number, number]]
  | [Record<'x' | 'y' | 'z', number>]
  | [Record<'r' | 'g' | 'b', number>]
  | [Vec3]
  | [Vec2, number]
  | [number, Vec2]

export type Vec4CreateArgs =
  | [number]
  | [number, number, number, number]
  | [[number, number, number, number]]
  | [Record<'x' | 'y' | 'z' | 'w', number>]
  | [Record<'r' | 'g' | 'b' | 'a', number>]
  | [Vec4]
  | [Vec3, number]
  | [number, Vec3]
  | [Vec2, number, number]
  | [number, Vec2, number]
  | [number, number, Vec2]
