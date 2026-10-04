import type { BaseMatrix } from './mat'

export const API_SYMBOL = Symbol('api')

export const operations: Record<string, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

// lives here (not in mat.ts) so vec.ts can use it without a circular import
export const isMatrix = (v: unknown): v is BaseMatrix => {
  return Boolean(v) && typeof v === 'function' && typeof (v as any)[API_SYMBOL]?.r === 'number'
}
