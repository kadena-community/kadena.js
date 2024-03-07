import { getLexerOutput } from '../lexer';

interface IToken {
  value: string;
  // TODO: complete this list and remove string
  type?:
    | 'lparen'
    | 'rparen'
    | 'dot'
    | 'string'
    | 'namespace'
    | 'arom'
    | 'decimal'
    | string;
}

export interface IPointer {
  next: () => IToken | undefined;
  reset: (id: number) => void;
  snapshot: (log?: boolean) => number;
  done: () => boolean;
}

export const getPointer = (contract: string): IPointer => {
  const tokensToSkip = ['model', 'comment', 'ws', 'nl'];
  const tokens: IToken[] = getLexerOutput(contract).filter(
    (token) => token.type === undefined || !tokensToSkip.includes(token.type),
  );
  let idx = -1;
  return {
    next: () => {
      if (idx === tokens.length - 1) return undefined;
      idx += 1;
      return tokens[idx];
    },
    reset: (val: number) => {
      idx = val;
    },
    snapshot: () => idx,
    done: () => idx === tokens.length - 1,
  };
};

export const getBlockPointer = (
  pointer: IPointer,
  initCounter = 1,
): IPointer => {
  let counter = initCounter;
  const snapshots: Record<number, number> = {};
  return {
    next() {
      const token = pointer.next();
      if (token?.type === 'lparen') {
        counter += 1;
      }
      if (token?.type === 'rparen') {
        counter -= 1;
      }
      return counter >= 0 ? token : undefined;
    },
    done() {
      return !counter || pointer.done();
    },
    snapshot(log?: boolean) {
      const idx = pointer.snapshot(log);
      snapshots[idx] = counter;
      return idx;
    },
    reset(idx: number) {
      if (snapshots[idx] !== undefined) {
        counter = snapshots[idx];
      }
      pointer.reset(idx);
    },
  };
};
