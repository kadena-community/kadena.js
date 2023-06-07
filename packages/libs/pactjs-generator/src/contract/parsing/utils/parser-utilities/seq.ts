import {
  IsWrappedData,
  isWrappedData,
  IWrappedData,
  unwrapData,
  UnwrappedObjects,
  wrapData,
} from '../dataWrapper';
import { UnionToIntersection } from '../typeUtilities';

import { FAILED, IParser, rule, RuleReturnType } from './rule';

export interface ISeq {
  <T extends Array<IParser>>(...parsers: T): IParser<
    IWrappedData<
      UnionToIntersection<
        UnwrappedObjects<IsWrappedData<RuleReturnType<T[number]>>>
      >,
      undefined
    >
  >;
}

export const seq: ISeq = (...parsers) =>
  rule((pointer) => {
    const results: IWrappedData<any, any>[] = [];
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const result = parser(pointer);
      if (result === FAILED) {
        return FAILED;
      }
      if (isWrappedData(result)) {
        results.push(result);
      }
    }
    if (results.length === 1) return results[0];
    if (results.length === 0) return wrapData(undefined);

    const returnValue = results.reduce(
      (acc, item) => ({
        ...acc,
        ...unwrapData(item),
      }),
      {},
    );

    return wrapData(returnValue);
  });
