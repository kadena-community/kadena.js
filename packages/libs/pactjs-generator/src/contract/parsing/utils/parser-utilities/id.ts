import { type IParser, FAILED, rule } from './rule';

interface IId {
  /**
   * Check if the token has a specific value and return that value.
   */
  (value: string): IParser<string>;
  /**
   * Check if the token has a specific value and return the second argument
   */
  <T>(value: string, returnValue: T): IParser<T>;
}

export const id: IId = (value: string, returnValue = value) =>
  rule((pointer) => {
    const token = pointer.next();
    return token?.value === value ? returnValue : FAILED;
  });
