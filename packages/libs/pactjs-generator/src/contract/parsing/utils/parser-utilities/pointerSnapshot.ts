import { IParser, rule } from './rule';

export const pointerSnapshot: IParser<number> = rule((pointer) =>
  pointer.snapshot(),
);
