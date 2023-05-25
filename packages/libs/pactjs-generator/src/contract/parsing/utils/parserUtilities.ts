/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @rushstack/typedef-var */

import { getBlockPointer, IPointer } from './getPointer';
import { trim } from './trim';
import { UnionToIntersection } from './typeUtilities';

export const FAILED = Symbol('Rule failed');
export const INSPECT = 'INSPECT';
export const NO_KEY = 'noKey';

export interface IParser<T extends any = any> {
  (pointer: IPointer): typeof FAILED | T;
  isRule?: boolean;
}

export interface IInspect {
  [INSPECT]: true;
}

type RuleReturn<T> = typeof FAILED | (T & IInspect);

type RuleReturnType<T extends IParser> = Exclude<ReturnType<T>, typeof FAILED>;

type HasInspect<T> = T extends IInspect ? T : never;

export interface INoFailedParser<T extends any = any> {
  (pointer: IPointer): typeof FAILED | T;
  isRule?: boolean;
}
interface IRule {
  <P extends IParser>(parser: P): P;
}
const rule: IRule = (parser: IParser) => {
  if (parser.isRule === true) return parser;
  const wrapperParser = (pointer: IPointer): any => {
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
  <T extends string, P extends IParser>(name: T, parser: P): (
    pointer: IPointer,
  ) => RuleReturn<{ [key in T]: RuleReturnType<P> }>;
  <P extends IParser>(parser: P): (
    pointer: IPointer,
  ) => RuleReturn<RuleReturnType<P>>;
}

export const $: IInspector = (one: string | IParser, second?: IParser) =>
  rule((pointer: IPointer) => {
    const name = typeof one === 'string' ? one : NO_KEY;
    const parser = second || (one as IParser);
    const result = parser(pointer);
    if (result === FAILED) return FAILED;

    // unwrap if the result has only "noKey"
    if (
      typeof result === 'object' &&
      Object.keys(result).length === 1 &&
      result[NO_KEY]
    ) {
      return { [name]: result[NO_KEY], [INSPECT]: true as const };
    }

    return { [name]: result, [INSPECT]: true as const };
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

const shouldInspect = (result: any) =>
  Boolean(result) && typeof result === 'object' && Boolean(result[INSPECT]);
interface ISeq {
  <T extends Array<IParser>>(...parsers: T): IParser<
    { [INSPECT]: true } & UnionToIntersection<
      HasInspect<RuleReturnType<T[number]>>
    >
  >;
}

export const seq: ISeq = (...parsers) =>
  rule((pointer: IPointer) => {
    let returnValue: RuleReturn<any> = {};
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const result = parser(pointer);
      if (result === FAILED) {
        pointer.snapshot();
        return FAILED;
      }
      if (shouldInspect(result)) {
        returnValue = { ...returnValue, ...result };
      }
    }
    return returnValue;
  });

type MakeArr<Type> = {
  [Property in keyof Type]: Type[Property][];
};

interface IRepeat {
  <T extends Array<IParser>>(...parsers: T): IParser<
    { [INSPECT]: true } & Partial<
      UnionToIntersection<MakeArr<HasInspect<RuleReturnType<T[number]>>>>
    >
  >;
}

/**
 * should be always the last parser in the block
 */
export const repeat: IRepeat = (...parsers: IParser[]) => {
  const oneOfParser = oneOf(...parsers);
  return rule((pointer: IPointer) => {
    const results: any[] = [];
    //@ts-ignore
    results[INSPECT] = true;
    while (!pointer.done()) {
      const result = oneOfParser(pointer);
      if (result === FAILED) {
        break;
      }
      if (shouldInspect(result)) {
        results.push(result);
      }
    }

    // flat the array as an object
    const returnValue = results.reduce(
      (acc, item) => {
        if (typeof item === 'object') {
          const keys = Object.keys(item);
          if (keys.length === 1) {
            const [key] = keys;
            acc[key] = acc[key] || [];
            acc[key].push(item[key]);
          } else {
            acc['not-categorized'] = acc['not-categorized'] || [];
            acc['not-categorized'].push(item);
          }
        }
        return acc;
      },
      { [INSPECT]: true },
    );

    return returnValue;
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
  });
};

interface IMaybe {
  <T extends IParser>(parser: T): INoFailedParser<
    RuleReturnType<T> | undefined
  >;
}

export const maybe: IMaybe = (parser: IParser) =>
  rule((pointer: IPointer) => {
    const result = parser(pointer);
    return result === FAILED ? undefined : result;
  });

interface ILookUp {
  <Type extends Record<string | symbol, IParser>>(
    parsers: Type,
  ): INoFailedParser<{
    [Property in keyof Type]: RuleReturnType<Type[Property]>[];
  }>;
}
/**
 * should be always the last parser in the block
 */
export const lookUp: ILookUp = (parsers: Record<string, IParser>) => {
  const needles = Object.keys(parsers);
  return rule((pointer: IPointer) => {
    const returnValue: Record<string | symbol, any> = {};
    while (!pointer.done()) {
      const token = pointer.next();
      if (token?.value && needles.includes(token.value)) {
        const parser = parsers[token.value] as IParser;
        const result = parser(pointer);
        if (result === FAILED) {
          break;
        }

        const key = token.value;

        const resultKeys = Object.keys(result);
        if (!resultKeys.length) return;
        returnValue[key] = returnValue[key] || [];
        if (resultKeys.length === 1 && resultKeys[0] === 'noKey') {
          returnValue[key].push(result.noKey);
        } else {
          returnValue[key].push(result);
        }
        // inspect implicitly to make the api cleaner
        // @ts-ignore
        returnValue[INSPECT] = true;
      }
    }
    return returnValue as any;
  });
};

const asString = (parser: IParser): IParser<string> =>
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
