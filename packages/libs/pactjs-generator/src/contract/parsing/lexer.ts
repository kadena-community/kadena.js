import type { Lexer } from 'moo';
import * as moo from 'moo';

/**
 * @internal
 */
export const lexer: Lexer = moo.compile({
  decimal: /[-+]?(?:[0-9]+[.])[0-9]+/,
  int: /[-+]?[0-9]+/,
  boolean: /true|false/,
  model: { match: /@model\s*\[[^\]]*\]/, lineBreaks: true },
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
  power: '^',
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
