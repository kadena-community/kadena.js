import { FAILED, IParser, rule } from './rule';

interface IId {
  <T extends string>(value: T): IParser<T>;
  <T>(value: string, returnValue: T): IParser<T>;
}

export const id: IId = (value: string, returnValue = value) =>
  rule((pointer) => {
    const token = pointer.next();
    return token?.value === value ? returnValue : FAILED;
  });
