import type { IParser } from './rule';
import { FAILED, rule } from './rule';

export const type: (name: string) => IParser<string> = (name: string) =>
  rule((pointer) => {
    const token = pointer.next();
    if (token !== undefined && token.type === name) return token.value;
    return FAILED;
  });
