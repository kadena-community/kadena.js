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
  /**
   * The order of the rules indicates their priority, meaning the most specific rule should be listed first
   * The function returns a wrappedData that is created by unwrapping all of its children.
   * However, if there is only one wrapped object without a name, the function returns it without performing any unwrapping
   */
  <T extends Array<IParser>>(
    ...parsers: T
  ): IParser<
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
    const results: Array<
      IWrappedData<unknown, string> | IWrappedData<unknown, undefined>
    > = [];
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

    if (results.length === 0) {
      return wrapData(undefined);
    }

    // If the value does not have a name, do not unwrap it. The parent can make a decision regarding it.
    // We can only have one object in this situation.
    if (results.length === 1 && results[0].name === undefined) {
      // TODO: in this case we need to somehow bypass UnionToIntersection in the typing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return results[0] as IWrappedData<any, undefined>;
    }

    const returnValue = results.reduce(
      (acc, item) => ({
        ...acc,
        ...unwrapData(item as object),
      }),
      {} as Record<string, unknown>,
    );

    return wrapData(returnValue);
  });
