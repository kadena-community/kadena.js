import type { IParser } from './rule';
import { rule } from './rule';

export const skipTheRest: IParser<boolean> = rule((pointer) => {
  while (!pointer.done()) pointer.next();
  return true;
});

export const skipToken: IParser<boolean> = rule((pointer) => {
  pointer.next();
  return true;
});
