import type { Lexer } from 'moo';
import * as moo from 'moo';

/**
 * @internal
 */
export const lexer: Lexer = moo.compile({
  decimal: /[-+]?(?:[0-9]+[.])?[0-9]+/,
  boolean: /true|false/,
  // https://pact-language.readthedocs.io/en/stable/pact-reference.html#atoms
  atom: {
    match: /[%#+\-_&$@<>=?*!|\/a-zA-Z]+[%#+\-_&$@<>=?*!|\/a-zA-Z0-9]*/,
    type: moo.keywords({
      bless: 'bless',
      defun: 'defun',
      defcap: 'defcap',
      defconst: 'defconst',
      defpact: 'defpact',
      defschema: 'defschema',
      deftable: 'deftable',
      let: 'let',
      let_star: 'let*',
      namespace: 'namespace',
      cond: 'cond',
      step: 'step',
      stepWithRollback: 'step-with-rollback',
      use: 'use',
      interface: 'interface',
      module: 'module',
      implements: 'implements',
    }),
  },
  symbol: /'[%#+\-_&$@<>=?*!|\/a-zA-Z0-9]+/,
  comment: { match: /;;?.*$/, lineBreaks: true },
  // ======== LITERALS ========
  dot: '.',
  lparen: '(',
  rparen: ')',
  lsquare: '[',
  rsquare: ']',
  comma: ',',
  lcurly: '{',
  rcurly: '}',
  dereference: '::',
  assign: ':=',
  colon: ':',
  // https://regex101.com/r/OVdomu/1/
  string: { match: /"(?:[^"\\]|\\.|\\\r?\n)*"/, lineBreaks: true },
  ws: /[ \t]+/,
  nl: { match: /\r?\n/, lineBreaks: true },
});

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function flattenRecursive<T extends readonly any[]>(arr: T): unknown[] {
//   return arr.reduce((acc, cur) => {
//     if (Array.isArray(cur)) {
//       return acc.concat(flattenRecursive(cur));
//     }
//     return acc.concat(cur);
//   }, []);
// }

/**
 * @internal
 */
// export const wrap =
//   <T>(type: string): ((arr: T[]) => { type: string; value: T[] }) =>
//   (arr: T[]) => {
//     return {
//       type,
//       value: arr,
//     };
//   };

/**
 * @internal
 */
// export const filterFlattenWrap =
//   <T>(type: string): ((arr: T[]) => { type: string; value: unknown[] }) =>
//   (arr: T[]) =>
//     wrap(type)(flattenRecursive(arr).filter(Boolean));

/**
 * @internal
 */
export interface ILogger {
  (msg: object | string, ...args: Array<object | string>): void;
}

export const getLexerOutput = (
  contract: string,
  logger: ILogger = () => {},
): moo.Token[] => {
  lexer.reset(contract);
  let token: moo.Token | undefined = undefined;

  const returnValue: moo.Token[] = [];

  while ((token = lexer.next())) {
    logger(token);
    returnValue.push(token);
  }
  return returnValue;
};
