import { IPointer } from '../getPointer';

import { IParser, rule } from './rule';

export const pointerSnapshot: IParser<number> = rule((pointer: IPointer) =>
  pointer.snapshot(),
);
