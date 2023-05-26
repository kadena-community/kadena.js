/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */

import {
  ExWrappedData,
  IsWrappedData,
  isWrappedData,
  unwrapData,
  UnwrappedObjects,
  wrapData,
  WrappedData,
} from './dataWrapper';
import { getBlockPointer, IPointer } from './getPointer';
import { trim } from './trim';
import { ExceptKeywords, UnionToIntersection } from './typeUtilities';

export const FAILED = Symbol('Rule failed');
export const NO_KEY = 'noKey';

export interface IParser<T extends any = any> {
  (pointer: IPointer): typeof FAILED | T;
  isRule?: boolean;
}

type RuleReturn<T, N extends string | undefined = string | undefined> =
  | typeof FAILED
  | ExWrappedData<T, N>;

type RuleReturnType<T extends IParser> = Exclude<ReturnType<T>, typeof FAILED>;
interface IRule {
  <P extends IParser>(parser: P): P;
}
export const rule: IRule = (parser) => {
  if (parser.isRule === true) return parser;
  const wrapperParser: IParser = (pointer): unknown => {
    const snapshot = pointer.snapshot();
    const result = parser(pointer);
    if (result === FAILED) {
      pointer.reset(snapshot);
    }
    return result;
  };
  wrapperParser.isRule = true;
  return wrapperParser as any;
};

interface IId {
  <T extends string>(value: T): IParser<T>;
  <T extends any>(value: string, returnValue: T): IParser<T>;
}

export const id: IId = (value: string, returnValue = value) =>
  rule((pointer: IPointer) => {
    const token = pointer.next();
    return token?.value === value ? returnValue : FAILED;
  });

export const ids = (list: string[]): IParser<string> => {
  // console.log('ids', list);
  return rule((pointer: IPointer) => {
    const token = pointer.next();
    if (!token) return FAILED;
    if (list.includes(token.value)) {
      return token.value;
    }
    return FAILED;
  });
};

export const str: IParser<string> = rule((pointer: IPointer) => {
  const token = pointer.next();
  if (!token || token.type !== 'string') return FAILED;
  return trim(token.value, '"');
});

export const atom: IParser<string> = rule((pointer: IPointer) => {
  const token = pointer.next();
  return token?.type === 'atom' ? token.value : FAILED;
});

export const pointerSnapshot: IParser<number> = rule((pointer: IPointer) =>
  pointer.snapshot(),
);

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
  rule((pointer: IPointer) => {
    const name = typeof one === 'string' ? one : undefined;
    if (name === 'inspect') throw new Error('inspect is a reserved name');
    const parser = second || (one as IParser);
    const result = parser(pointer);
    if (result === FAILED) return FAILED;
    return wrapData(result, name);
  });

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
interface ISeq {
  <T extends Array<IParser>>(...parsers: T): IParser<
    WrappedData<
      UnionToIntersection<
        UnwrappedObjects<IsWrappedData<RuleReturnType<T[number]>>>
      >,
      undefined
    >
  >;
}

export const seq: ISeq = (...parsers) =>
  rule((pointer: IPointer) => {
    const results: WrappedData<any, any>[] = [];
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

type MakeArr<Type> = {
  [Property in keyof Type]: Type[Property][];
};

interface IRepeat {
  <T extends Array<IParser>>(...parsers: T): IParser<
    WrappedData<
      Partial<
        UnionToIntersection<
          MakeArr<UnwrappedObjects<IsWrappedData<RuleReturnType<T[number]>>>>
        >
      >,
      undefined
    >
  >;
}

/**
 * should be always the last parser in the block
 */
export const repeat: IRepeat = (...parsers: IParser[]) => {
  const oneOfParser = oneOf(...parsers);
  return rule((pointer: IPointer) => {
    const results: WrappedData[] = [];
    while (!pointer.done()) {
      const result = oneOfParser(pointer);
      if (result === FAILED) {
        break;
      }
      if (isWrappedData(result)) {
        results.push(result);
      }
    }

    const pushUnique = <T>(arr: T[] = [], item: any): T[] => {
      if (!arr.includes(item)) {
        arr.push(item);
      }
      return arr;
    };

    // flat the array as an object
    const returnValue = results.reduce((acc, item) => {
      const name = item.name;
      if (name) {
        acc[name] = pushUnique(acc[name], item.data);
      } else {
        if (typeof item.data === 'object') {
          const keys = Object.keys(item.data);
          keys.forEach((key) => {
            acc[key] = pushUnique(acc[key], item.data);
          });
        } else if (item.data !== undefined) {
          acc['not-categorized'] = pushUnique(
            acc['not-categorized'],
            item.data,
          );
        }
      }

      return acc;
    }, {} as Record<string, any[]>);

    return wrapData(returnValue as any);
  });
};

export const skipTheRest: IParser<boolean> = rule((pointer: IPointer) => {
  while (!pointer.done()) pointer.next();
  return true;
});

export const skipToken: IParser<boolean> = rule((pointer: IPointer) => {
  pointer.next();
  return true;
});

export const block: ISeq = (...parsers: IParser[]) => {
  const seqParser = seq(...parsers, skipTheRest);
  return rule((pointer: IPointer) => {
    const token = pointer.next();
    if (token?.type !== 'lparen') return FAILED;
    const blockPinter: IPointer = getBlockPointer(pointer);
    return seqParser(blockPinter);
  }) as any;
};

interface IMaybe {
  <T extends IParser>(parser: T): (
    pointer: IPointer,
  ) => RuleReturnType<T> | undefined;
}

export const maybe: IMaybe = (parser: IParser) =>
  rule((pointer: IPointer) => {
    const result = parser(pointer);
    return result === FAILED ? undefined : result;
  });

export const asString = (parser: IParser): IParser<string> =>
  rule((pointer: IPointer) => {
    const start = pointer.snapshot();
    const result = parser(pointer) as any;
    const end = pointer.snapshot();
    if (result === FAILED) return FAILED;
    pointer.reset(start);
    let val = '';
    for (let i = start; i < end; i += 1) {
      val += pointer.next()?.value;
    }
    return val;
  });

// match first.second.third
export const dotedAtom = asString(seq(repeat(seq(atom, id('.'))), atom));
