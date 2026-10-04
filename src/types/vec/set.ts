import { ConsistsOfUniqueChars, ConsistsOnlyOfChars, LengthInRange } from '../utils/ts-string'

type SetSelection<
  T extends string,
  Coordinates extends string,
  MinLength extends number,
  MaxLength extends number,
> =
  T extends LengthInRange<T, MinLength, MaxLength>
    ? T extends ConsistsOnlyOfChars<T, Coordinates>
      ? T extends ConsistsOfUniqueChars<T>
        ? T
        : never
      : never
    : never

export type Set_XYZW_Selection<T extends string, N extends 2 | 3 | 4> = N extends 2
  ? SetSelection<T, 'x' | 'y', 1, 4>
  : N extends 3
    ? SetSelection<T, 'x' | 'y' | 'z', 1, 4>
    : N extends 4
      ? SetSelection<T, 'x' | 'y' | 'z' | 'w', 1, 4>
      : never

export type Set_RGBA_Selection<T extends string, N extends 2 | 3 | 4> = N extends 2
  ? SetSelection<T, 'r' | 'g', 1, 4>
  : N extends 3
    ? SetSelection<T, 'r' | 'g' | 'b', 1, 4>
    : N extends 4
      ? SetSelection<T, 'r' | 'g' | 'b' | 'a', 1, 4>
      : never
