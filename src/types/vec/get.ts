import { ConsistsOnlyOfChars, LengthInRange } from '../utils/ts-string'

type GetSelection<
  T extends string,
  Coordinates extends string,
  MinLength extends number,
  MaxLength extends number,
> =
  T extends LengthInRange<T, MinLength, MaxLength>
    ? T extends ConsistsOnlyOfChars<T, Coordinates>
      ? T
      : never
    : never

export type Get_XYZW_Selection<T extends string, N extends 2 | 3 | 4> = N extends 2
  ? GetSelection<T, 'x' | 'y', 1, 4>
  : N extends 3
    ? GetSelection<T, 'x' | 'y' | 'z', 1, 4>
    : N extends 4
      ? GetSelection<T, 'x' | 'y' | 'z' | 'w', 1, 4>
      : never

export type Get_RGBA_Selection<T extends string, N extends 2 | 3 | 4> = N extends 2
  ? GetSelection<T, 'r' | 'g', 1, 4>
  : N extends 3
    ? GetSelection<T, 'r' | 'g' | 'b', 1, 4>
    : N extends 4
      ? GetSelection<T, 'r' | 'g' | 'b' | 'a', 1, 4>
      : never
