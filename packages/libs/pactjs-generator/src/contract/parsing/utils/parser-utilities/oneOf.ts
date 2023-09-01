import { type IParser, FAILED, rule } from './rule';

interface IOneOf {
  <T extends Array<IParser>>(...parsers: T): T[number];
}

export const oneOf: IOneOf = (...parsers) =>
  rule((pointer) => {
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const result = parser(pointer);
      if (result !== FAILED) return result;
    }
    return FAILED;
  });
