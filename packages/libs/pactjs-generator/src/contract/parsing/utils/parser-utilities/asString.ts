import { FAILED, IParser, rule } from './rule';

export const asString = (parser: IParser): IParser<string> =>
  rule((pointer) => {
    const start = pointer.snapshot();
    const result = parser(pointer);
    const end = pointer.snapshot();
    if (result === FAILED) return FAILED;
    pointer.reset(start);
    let val = '';
    for (let i = start; i < end; i += 1) {
      val += pointer.next()?.value;
    }
    return val;
  });
