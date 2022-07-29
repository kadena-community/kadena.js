import type { Lexer } from 'moo';
import * as moo from 'moo';

/**
 * @internal
 */
export const lexer: Lexer = moo.compile({
  TYPED_IDEN: /[a-zA-Z-_0-9]+:[a-zA-Z-_{}.0-9]+/,
  name: {
    match: /[a-zA-Z-_*]+/,
    type: moo.keywords({
      KW_DEFUN: 'defun',
      KW_MODULE: 'module',
    }),
  },
  postEscapedNewline: /\s*[\\|\\\\]/,
  WS: /[ \t]+/,
  lparen: '(',
  rparen: ')',
  lsquare: '[',
  rsquare: ']',
  lcurly: '{',
  rcurly: '}',
  assign: ':=',

  comma: ',',
  string: { match: /"(?:[^"\\]|\\.|\\\n)*"/, lineBreaks: true },
  newlineEscape: {
    match: /[\\|\\\\][\n]\s*/,
    lineBreaks: true,
  },
  singleQuote: /'/,
  doubleQuote: /"/,
  plus: '+',
  number: /-?\d+/,
  colon: ':',
  equals: '=',
  comment: /;;?.*/,
  module: /\'[a-zA-Z_-]+/,
  guard: /@[a-zA-Z-_]+/,
  gt: '>',
  lt: '<',
  float: /-?\d+\.\d+/,
  dot: '.',
  NOT_IS: /!=/,
  NL: { match: /\n/, lineBreaks: true },
});

/**
 * @internal
 */
export interface ILocation {
  line: number;
  col: number;
}
/**
 * @internal
 */
export type Arg = { name: string; type: string | undefined } & ILocation;
/**
 * @internal
 */
export type Defun = {
  method: string;
  returnType: string;
  args: Record<string, Arg>;
} & ILocation;
/**
 * @internal
 */
export interface IState {
  stack: string[];
  moduleName: string;
  defunName: string;
}

/**
 * @internal
 */
export type Module = {
  name: string;
  defuns: Record<string, Defun>;
} & ILocation;
/**
 * @internal
 */
export type Output = Record<string, Module>;

/**
 * @internal
 */
export interface ILogger {
  (msg: object | string, ...args: Array<object | string>): void;
}

/**
 * @internal
 */
export function getModuleAndMethods(contract: string, logger: ILogger): Output {
  lexer.reset(contract);

  let token: moo.Token | undefined = undefined;
  const state: IState = { stack: [], moduleName: '', defunName: '' } as IState;

  const output: Output = {} as Output;
  while ((token = lexer.next())) {
    logger(token);
    switch (token.type) {
      case 'KW_MODULE':
        state.stack.push('module');
        logger('push module');
        break;
      case 'name':
        if (
          state.stack.includes('module') &&
          !state.stack.includes('defun') &&
          !state.stack.includes('args')
        ) {
          // module
          if (!state.moduleName) {
            state.moduleName = token.value;
            output[token.value] = {
              name: token.value,
              defuns: {},
              line: token.line,
              col: token.col,
            };
          }
        } else if (
          state.stack.includes('module') &&
          state.stack.includes('defun') &&
          !state.stack.includes('args')
        ) {
          // module, defun
          if (output[state.moduleName].defuns[token.value] === undefined) {
            const [method, returnType] = token.value.split(':');
            state.defunName = token.value;
            output[state.moduleName].defuns[token.value] = {
              method,
              returnType,
              line: token.line,
              col: token.col,
              args: {},
            };
            state.stack.push('args');
            logger('push args');
          }
        } else if (
          state.stack.includes('module') &&
          state.stack.includes('defun') &&
          state.stack.includes('args')
        ) {
          const { line, col } = token;
          output[state.moduleName].defuns[state.defunName].args[token.value] = {
            line,
            col,
            name: token.value,
            type: undefined,
          };
        }
        break;
      case 'KW_DEFUN':
        if (state.stack.includes('module')) {
          state.stack.push('defun');
          logger('push defun');
        }
        break;

      case 'TYPED_IDEN':
        if (
          state.stack.includes('module') &&
          state.stack.includes('defun') &&
          !state.stack.includes('args')
        ) {
          if (output[state.moduleName].defuns[token.value] === undefined) {
            state.defunName = token.value;
            const [method, returnType] = token.value.split(':');
            output[state.moduleName].defuns[token.value] = {
              method,
              returnType,
              line: token.line,
              col: token.col,
              args: {},
            };
          }
        } else if (
          state.stack.includes('module') &&
          state.stack.includes('defun') &&
          state.stack.includes('args')
        ) {
          const [name, type] = token.value.split(':');
          output[state.moduleName].defuns[state.defunName].args[token.value] = {
            name,
            type,
            line: token.line,
            col: token.col,
          };
        }
        break;
      case 'lparen':
        if (state.stack.includes('defun') && !state.stack.includes('args')) {
          state.stack.push('args');
          logger('push args');
        }
        break;
      case 'rparen':
        if (state.stack.includes('args')) {
          // pop 'args'
          logger('pop args');
          logger('popping', state.stack[state.stack.length - 1]);
          state.stack.pop();
          // pop 'defun'
          logger('pop defun');
          logger('popping', state.stack[state.stack.length - 1]);
          state.stack.pop();
          // remove current defunName
          state.defunName = '';
        }
        break;
      default:
        break;
    }
  }
  return output;
}
