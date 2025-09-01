export const xyzw = ['x', 'y', 'z', 'w'] as const
export const rgba = ['r', 'g', 'b', 'a'] as const

export const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
} satisfies Record<string, (a: number, b: number) => number>
