import type { Vec2, Vec3, Vec4 } from '.'

export type Vec2ContructorArgs =
  | [number]
  | [number, number]
  | [[number, number]]
  | [Record<'x' | 'y', number>]
  | [Record<'r' | 'g', number>]
  | [Vec2]
  | [Vec3]
  | [Vec4]

export type Vec3ContructorArgs =
  | [number]
  | [number, number, number]
  | [[number, number, number]]
  | [Record<'x' | 'y' | 'z', number>]
  | [Record<'r' | 'g' | 'b', number>]
  | [Vec3]
  | [Vec4]
  | [Vec2, number]
  | [number, Vec2]

export type Vec4ContructorArgs =
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
