import type { Compare } from './ts-number'
import type { Expect, Equal, Not } from './ts-debug'

export type Length<
  T extends string,
  Acc extends string[] = [],
> = T extends `${infer Head}${infer Tail}` ? Length<Tail, [...Acc, Head]> : Acc['length']

export type MaxLength<T extends string, Max extends number> =
  Compare<Length<T>, Max> extends 'less' | 'equal' ? T : never

export type MinLength<T extends string, Min extends number> =
  Compare<Length<T>, Min> extends 'greater' | 'equal' ? T : never

export type LengthInRange<T extends string, Min extends number, Max extends number> = MinLength<
  T,
  Min
> &
  MaxLength<T, Max>

type OnlyOfChars<T extends string, Chars extends string> = T extends ''
  ? unknown
  : T extends `${Chars}${infer Tail}`
    ? OnlyOfChars<Tail, Chars>
    : never

export type ConsistsOnlyOfChars<T extends string, Chars extends string> = T & OnlyOfChars<T, Chars>

type OfUniqueChars<T extends string, Acc extends string[]> = T extends ''
  ? unknown
  : T extends `${infer Head}${infer Tail}`
    ? Head extends Acc[number]
      ? never
      : OfUniqueChars<Tail, [...Acc, Head]>
    : never

export type ConsistsOfUniqueChars<T extends string> = T & OfUniqueChars<T, []>

type Tests = [
  Expect<Equal<ConsistsOfUniqueChars<''>, ''>>,
  Expect<Equal<ConsistsOfUniqueChars<'a'>, 'a'>>,
  Expect<Equal<ConsistsOfUniqueChars<'ab'>, 'ab'>>,
  Expect<Equal<ConsistsOfUniqueChars<'abcdef'>, 'abcdef'>>,

  Expect<Not<Equal<ConsistsOfUniqueChars<'aa'>, 'aa'>>>,
  Expect<Equal<ConsistsOfUniqueChars<'aa'>, never>>,

  Expect<Not<Equal<ConsistsOfUniqueChars<'abcdefgh a'>, 'abcdefgh a'>>>,
  Expect<Equal<ConsistsOfUniqueChars<'abcdefgh a'>, never>>,
]

export {}
