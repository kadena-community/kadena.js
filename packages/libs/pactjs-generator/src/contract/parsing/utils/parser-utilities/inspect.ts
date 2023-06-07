import { wrapData } from '../dataWrapper';
import { IPointer } from '../getPointer';
import { ExceptKeywords } from '../typeUtilities';

import { FAILED, IParser, rule, RuleReturn, RuleReturnType } from './rule';

interface IInspector {
  /**
   *
   * @param name name can be any string, except for "inspect," which is a reserved name.
   */
  <T extends string, P extends IParser>(
    name: ExceptKeywords<T, 'inspect'>,
    parser: P,
  ): (pointer: IPointer) => RuleReturn<RuleReturnType<P>, T>;
  <P extends IParser>(parser: P): (
    pointer: IPointer,
  ) => RuleReturn<RuleReturnType<P>>;
}

export const $: IInspector = (one: string | IParser, second?: IParser) =>
  rule((pointer) => {
    const name = typeof one === 'string' ? one : undefined;
    if (name === 'inspect') throw new Error('inspect is a reserved name');
    const parser = second || (one as IParser);
    const result = parser(pointer);
    if (result === FAILED) return FAILED;
    return wrapData(result, name);
  });
