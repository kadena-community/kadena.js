import type { ExWrappedData } from '../dataWrapper';
import type { IPointer } from '../getPointer';

// eslint-disable-next-line @rushstack/typedef-var
export const FAILED = Symbol('FAILED');

export interface IParser<T = unknown, F = typeof FAILED> {
  (pointer: IPointer): F | T;
  isRule?: boolean;
}

export type RuleReturn<T, N extends string | undefined = string | undefined> =
  | typeof FAILED
  | ExWrappedData<T, N>;

export type RuleReturnType<T extends IParser> = Exclude<
  ReturnType<T>,
  typeof FAILED
>;

export const rule = <P extends IParser>(parser: P): P => {
  if (parser.isRule === true) return parser;
  const wrapperParser = ((pointer) => {
    const snapshot = pointer.snapshot();
    const result = parser(pointer);
    if (result === FAILED) {
      pointer.reset(snapshot);
    }
    return result;
  }) as P;
  wrapperParser.isRule = true;
  return wrapperParser;
};
