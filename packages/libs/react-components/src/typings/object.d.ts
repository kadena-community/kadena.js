type IsAny<T> = 0 extends 1 & T ? true : T;
type KnownKeys<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};
type IsEmptyObject<T extends Record<PropertyKey, unknown>> = [keyof T] extends [
  never,
]
  ? true
  : false;

type ObjectKeys<T> = IsAny<T> extends true
  ? string[]
  : T extends object
  ? IsEmptyObject<KnownKeys<T>> extends true
    ? string[]
    : (keyof KnownKeys<T>)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;

// interface can be merged together
interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
