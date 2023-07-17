import { trim } from '../utils';

import { FAILED, IParser, rule } from './rule';

export const str: IParser<string> = rule((pointer) => {
  const token = pointer.next();
  if (token !== undefined && token.type === 'string')
    return trim(token.value, '"');
  // for now we only consider symbols as string, we can split this two different parser if there is separate scenario
  if (token?.type === 'symbol') return trim(token.value, "'");
  return FAILED;
});
