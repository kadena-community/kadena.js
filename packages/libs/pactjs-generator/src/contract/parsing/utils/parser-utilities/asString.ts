import type { IParser } from './rule';
import { FAILED, rule } from './rule';

export const asString = (parser: IParser, join = ''): IParser<string> =>
  rule((pointer) => {
    const start = pointer.snapshot();
    const result = parser(pointer);
    const end = pointer.snapshot();
    if (result === FAILED) return FAILED;
    pointer.reset(start);
    let val = '';
    for (let i = start; i < end; i += 1) {
      const space = val === '' ? '' : join;
      val += space + pointer.next()?.value;
    }
    return val;
  });
