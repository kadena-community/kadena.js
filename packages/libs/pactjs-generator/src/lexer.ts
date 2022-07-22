import * as moo from 'moo';
import { readFileSync } from 'fs';
import { join } from 'path';

export const lexer = moo.compile({
  TYPED_IDEN: /[a-zA-Z-_0-9]+:[a-zA-Z-_{}.0-9]+/,
  name: {
    match: /[a-zA-Z-_]+/,
    type: moo.keywords({
      KW_BLESS: 'bless',
      KW_DEFCONST: 'defconst',
      KW_DEFPACT: 'defpact',
      KW_DEFSCHEMA: 'defschema',
      KW_DEFTABLE: 'deftable',
      KW_DEFUN: 'defun',
      KW_DEFCAP: 'defcap',
      KW_FALSE: 'false',
      KW_IMPLEMENTS: 'implements',
      KW_INTERFACE: 'interface',
      KW_LET: 'let',
      KW_LET_STAR: 'let*',
      KW_LAMBDA: 'lambda',
      KW_MODULE: 'module',
      KW_STEP: 'step',
      KW_STEP_WITH_ROLLBACK: 'step-with-rollback',
      KW_TRUE: 'true',
      KW_USE: 'use',
      KW_COND: 'cond',
      KW_WITH_CAPABILITY: 'with-capability',
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
  CATCHALL: { match: /.+/, value: (str) => str },
});

lexer.reset(
  readFileSync(join(__dirname, './tests/coin.contract.pact'), 'utf8'),
);

let token: moo.Token | undefined = undefined;
type Location = { line: number; col: number };
type Arg = { name: string; type: string } & Location;
type Defun = {
  method: string;
  returnType: string;
  args: Record<string, Arg>;
} & Location;
type State = { stack: string[]; moduleName: string; defunName: string };
const state: State = { stack: [], moduleName: '', defunName: '' } as State;

type Module = { name: string; defuns: Record<string, Defun> } & Location;
type Output = Record<string, Module>;
const output: Output = {} as Output;
while ((token = lexer.next())) {
  console.log(token);
  switch (token.type) {
    case 'KW_MODULE':
      state.stack.push('module');
      console.log('push module');
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
      }
      if (
        state.stack.includes('module') &&
        state.stack.includes('defun') &&
        !state.stack.includes('args')
      ) {
        // module, defun
        if (!output[state.moduleName].defuns[token.value]) {
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
          console.log('push args');
        }
      }
      break;
    case 'KW_DEFUN':
      if (state.stack.includes('module')) {
        state.stack.push('defun');
        console.log('push defun');
      }
      break;

    case 'TYPED_IDEN':
      if (
        state.stack.includes('module') &&
        state.stack.includes('defun') &&
        !state.stack.includes('args')
      ) {
        if (!output[state.moduleName].defuns[token.value]) {
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
      }

      if (state.stack.includes('args')) {
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
        console.log('push args');
      }
      break;
    case 'rparen':
      if (state.stack.includes('args')) {
        // pop 'args'
        console.log('pop args');
        console.log('popping', state.stack[state.stack.length - 1]);
        state.stack.pop();
        // pop 'defun'
        console.log('pop defun');
        console.log('popping', state.stack[state.stack.length - 1]);
        state.stack.pop();
        // remove current defunName
        state.defunName = '';
      }
      break;
    default:
      break;
  }
}

console.log(
  'output.coin.defuns.length',
  Object.keys(output.coin.defuns).length,
);

Object.keys(output.coin.defuns).forEach((x) => console.log(x));
