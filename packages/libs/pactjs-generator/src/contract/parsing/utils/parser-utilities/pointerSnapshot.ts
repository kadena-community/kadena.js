import type { IParser } from './rule';
import { rule } from './rule';

/**
 * This function returns a snapshot of the pointer. It can be helpful when you need to reference the pointer index at a later time.
 * For instance, you might use it to parse function bodies again in order to locate all function calls after you've already prepared a list of them during the initial iteration
 */
export const pointerSnapshot: IParser<number, never> = rule((pointer) =>
  pointer.snapshot(),
);
