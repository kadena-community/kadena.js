import { getBlockPinter, IPointer } from './getPointer';
import { trim } from './trim';

import { Token } from 'moo';

export interface IParser {
  (pointer: IPointer): any;
}

export const FAILED = Symbol('Rule failed');
export const INSPECT = Symbol('Inspect the item');
export const NO_KEY = 'noKey';

export const id =
  (value: string, re: any = value) =>
  (pointer: IPointer) => {
    const token = pointer.next();
    return token?.value === value ? re : FAILED;
  };

export const str = (pointer: IPointer) => {
  const token = pointer.next();
  if (!token || token.type !== 'string') return FAILED;
  return trim(token.value, '"');
};

export const atom = (pointer: IPointer) => {
  const token = pointer.next();
  return token?.type === 'atom' ? token.value : FAILED;
};

export const pointerSnapshot = (pointer: IPointer) => pointer.snapshot();

// check this has an issue
export const dotedAtom = (pointer: IPointer) => {
  let token: Token | undefined = undefined;
  const result: string[] = [];

  let snapshot = pointer.snapshot();

  const getResult = () => {
    pointer.reset(snapshot);
    if (result.length) {
      return result.join('.');
    }
    return FAILED;
  };

  let dotTurn = false;

  while ((token = pointer.next())) {
    switch (token.type) {
      case 'atom':
        if (dotTurn) {
          return getResult();
        }
        result.push(token.value);
        break;
      case 'dot':
        if (!dotTurn) {
          return FAILED;
        }
        break;
      default:
        return getResult();
    }
    snapshot = pointer.snapshot();
    dotTurn = !dotTurn;
  }
  return FAILED;
};

interface IInspect {
  (name: string, parser: IParser): (pointer: IPointer) => any;
  (parser: IParser): (pointer: IPointer) => any;
}

export const $: IInspect =
  (one: string | IParser, second?: IParser) => (pointer: IPointer) => {
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
      return { [name]: result[NO_KEY], [INSPECT]: true };
    }

    return { [name]: result, [INSPECT]: true };
  };

export const oneOf =
  (...parsers: IParser[]) =>
  (pointer: IPointer) => {
    const snapshot = pointer.snapshot();
    for (let i = 0; i < parsers.length; i++) {
      const parser = parsers[i];
      const result = parser(pointer);
      if (result !== FAILED) return result;
      pointer.reset(snapshot);
    }
    return FAILED;
  };

const shouldInspect = (result: any) =>
  result && typeof result === 'object' && result[INSPECT];

export const seq =
  (...parsers: IParser[]) =>
  (pointer: IPointer) => {
    let returnValue = {};
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
  };

/**
 * should be always the last parser in the block
 */
export const list = (...parsers: IParser[]) => {
  const oneOfParser = oneOf(...parsers);
  return (pointer: IPointer) => {
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
  };
};

export const skipTheRest = (pointer: IPointer) => {
  while (!pointer.done()) pointer.next();
  return true;
};

export const block = (...parsers: IParser[]) => {
  const seqParser = seq(...parsers, skipTheRest);
  return (pointer: IPointer) => {
    const token = pointer.next();
    if (token?.type !== 'lparen') return FAILED;
    const blockPinter: IPointer = getBlockPinter(pointer);
    return seqParser(blockPinter);
  };
};

export const maybe = (parser: IParser) => (pointer: IPointer) => {
  const snapshot = pointer.snapshot();
  const result = parser(pointer);
  if (result === FAILED) {
    pointer.reset(snapshot);
  }
  return result === FAILED ? '' : result;
};

/**
 * should be always the last parser in the block
 */
export const lookUp = (parsers: Record<string, IParser>) => {
  const needles = Object.keys(parsers);
  return (pointer: IPointer) => {
    const returnValue: Record<string | symbol, any> = {};
    while (!pointer.done()) {
      const token = pointer.next();
      if (token?.value && needles.includes(token.value)) {
        const parser = parsers[token.value] as IParser;
        const snapshot = pointer.snapshot();
        const result = parser(pointer);
        if (result === FAILED) {
          pointer.reset(snapshot);
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
    return returnValue;
  };
};

/**
 * run the children on the same area
 */
// const muliple: IParser = null;
