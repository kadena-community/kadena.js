import { IWrappedData, wrapData } from '../dataWrapper';

import { FAILED, IParser, rule } from './rule';

interface IMaybe {
  <T>(parser: IParser<T>): IParser<T | IWrappedData<undefined>, never>;
}

export const maybe: IMaybe = (parser) =>
  rule((pointer) => {
    const result = parser(pointer);
    return result === FAILED ? wrapData(undefined) : result;
  });
