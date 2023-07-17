export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type ExceptKeywords<Str, Keywords> = Str extends string
  ? Str extends Keywords
    ? never
    : Str
  : Str;
