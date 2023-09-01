import { type IParser, FAILED, rule } from './rule';

interface IIds {
  (list: string[]): IParser<string>;
  <T>(list: string[], mapper: (idx: number, list: string[]) => T): IParser<T>;
}

export const ids: IIds = (
  list: string[],
  mapper = (idx: number, list: string[]) => list[idx],
) => {
  return rule((pointer) => {
    const token = pointer.next();
    if (!token) return FAILED;
    const findIndex = list.findIndex((item) => item === token.value);
    if (findIndex >= 0) {
      return mapper(findIndex, list);
    }
    return FAILED;
  });
};
