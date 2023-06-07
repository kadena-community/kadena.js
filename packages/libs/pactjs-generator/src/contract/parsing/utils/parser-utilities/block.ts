import { getBlockPointer, IPointer } from '../getPointer';

import { FAILED, IParser, rule } from './rule';
import { ISeq, seq } from './seq';
import { skipTheRest } from './skip';

export const block: ISeq = (...parsers: IParser[]) => {
  const seqParser = seq(...parsers, skipTheRest);
  return rule((pointer: IPointer) => {
    const token = pointer.next();
    if (token?.type !== 'lparen') return FAILED;
    const blockPinter = getBlockPointer(pointer);
    return seqParser(blockPinter);
  }) as any;
};
