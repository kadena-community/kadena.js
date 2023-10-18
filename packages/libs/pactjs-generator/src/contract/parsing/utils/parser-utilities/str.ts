import { trim } from '../utils';
import type { IParser } from './rule';
import { FAILED, rule } from './rule';

export const str: IParser<string> = rule((pointer) => {
  const token = pointer.next();
  if (token !== undefined && token.type === 'string')
    return trim(token.value, '"');
  // For now, we are treating symbols as strings. If there is a separate scenario, we can split this parser into two different parsers
  if (token?.type === 'symbol') return trim(token.value, "'");
  return FAILED;
});
