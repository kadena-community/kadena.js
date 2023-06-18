import { trim } from '../utils';

import { FAILED, IParser, rule } from './rule';

export const str: IParser<string> = rule((pointer) => {
  const token = pointer.next();
  if (!token || token.type !== 'string') return FAILED;
  return trim(token.value, '"');
});
