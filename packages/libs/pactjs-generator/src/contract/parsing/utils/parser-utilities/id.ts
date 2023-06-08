import { FAILED, IParser, rule } from './rule';

interface IId {
  (value: string): IParser<string>;
  <T>(value: string, returnValue: T): IParser<T>;
}

export const id: IId = (value: string, returnValue = value) =>
  rule((pointer) => {
    const token = pointer.next();
    return token?.value === value ? returnValue : FAILED;
  });
