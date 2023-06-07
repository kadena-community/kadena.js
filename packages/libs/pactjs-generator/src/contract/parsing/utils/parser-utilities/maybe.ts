import { IPointer } from '../getPointer';

import { FAILED, IParser, rule } from './rule';

export const maybe = <T extends unknown>(
  parser: IParser<T>,
): IParser<T, never> =>
  rule((pointer: IPointer) => {
    const result = parser(pointer);
    return result === FAILED ? undefined : result;
  }) as any;
