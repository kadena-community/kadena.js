import { IPointer } from '../getPointer';

import { FAILED, IParser, rule } from './rule';

interface IId {
  <T extends string>(value: T): IParser<T>;
  <T extends unknown>(value: string, returnValue: T): IParser<T>;
}

export const id: IId = (value: string, returnValue = value) =>
  rule((pointer: IPointer) => {
    const token = pointer.next();
    return token?.value === value ? returnValue : FAILED;
  });
