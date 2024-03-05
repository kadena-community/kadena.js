import { getBlockPointer } from '../getPointer';
import { FAILED, rule } from './rule';
import type { ISeq } from './seq';
import { seq } from './seq';
import { skipTheRest } from './skip';

export const block: ISeq = (...parsers) => {
  const seqParser = seq(...parsers, skipTheRest);
  return rule((pointer) => {
    const token = pointer.next();
    if (token?.type !== 'lparen') return FAILED;
    const blockPinter = getBlockPointer(pointer);
    return seqParser(blockPinter);
  });
};

export const restrictedBlock: ISeq = (...parsers) => {
  const seqParser = seq(...parsers);
  return rule((pointer) => {
    const token = pointer.next();
    if (token?.type !== 'lparen') return FAILED;
    const blockPinter = getBlockPointer(pointer);
    const result = seqParser(blockPinter);
    const lastToken = pointer.next();
    if (lastToken?.type !== 'rparen') return FAILED;
    return result;
  });
};
