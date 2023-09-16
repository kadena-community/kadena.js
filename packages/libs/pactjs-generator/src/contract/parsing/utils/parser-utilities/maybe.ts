import type { IParser } from './rule';
import { FAILED, rule } from './rule';

interface IMaybe {
  <T>(parser: IParser<T>): IParser<T, never>;
}

export const maybe: IMaybe = (parser) =>
  rule((pointer) => {
    const result = parser(pointer);
    // adding undefined to the return type causes some issues in type inferring probably when it uses UnionToIntersection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result === FAILED ? (undefined as any) : result;
  });
