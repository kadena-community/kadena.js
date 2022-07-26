import nearley from 'nearley';
const grammar = require('./grammar')

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

export type Location = { line: number; col: number };
export type Arg = { name: string; type: string } & Location;
export type Defun = {
  method: string;
  returnType: string;
  args: Record<string, Arg>;
} & Location;
export type State = { stack: string[]; moduleName: string; defunName: string };

export type Module = { name: string; defuns: Record<string, Defun> } & Location;
export type Output = Record<string, Module>;

export function getModuleAndMethods(
  contract: string,
  logger: (msg: any, ...args: any[]) => void = () => {},
): Output {
  const pa = parser.feed(contract);

  console.log(pa.results);

  const lexor = parser.lexer;
  lexor.reset(contract);

  let token: any // nearley.Token | undefined = undefined;
  const state: State = { stack: [], moduleName: '', defunName: '' } as State;

  const output: Output = {} as Output;
  while ((token = lexor.next())) {
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
            logger('push args');
          }
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
