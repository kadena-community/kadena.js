import { IPointer } from '../getPointer';

import { FAILED, IParser, rule } from './rule';

export const atom: IParser<string> = rule((pointer: IPointer) => {
  const token = pointer.next();
  return token?.type === 'atom' ? token.value : FAILED;
});
