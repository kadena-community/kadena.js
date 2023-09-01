import { wrapData } from '../dataWrapper';
import { type IPointer } from '../getPointer';
import { type ExceptKeywords } from '../typeUtilities';

import {
  type IParser,
  type RuleReturn,
  type RuleReturnType,
  FAILED,
  rule,
} from './rule';

interface IInspector {
  /**
   *
   * @param name name can be any string, except for "inspect," which is a reserved name.
   */
  <T extends string, P extends IParser>(
    name: ExceptKeywords<T, 'inspect'>,
    parser: P,
  ): (pointer: IPointer) => RuleReturn<RuleReturnType<P>, T>;
  <P extends IParser>(
    parser: P,
  ): (pointer: IPointer) => RuleReturn<RuleReturnType<P>, undefined>;
}

export const $: IInspector = (one: string | IParser, second?: IParser) =>
  rule((pointer) => {
    const name = typeof one === 'string' ? one : undefined;
    if (name === 'inspect') throw new Error('inspect is a reserved name');
    const parser = second || (one as IParser);
    const result = parser(pointer);
    if (result === FAILED) return FAILED;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return wrapData(result, name) as any;
  });
