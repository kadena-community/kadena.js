import { ILogger, lexer } from './lexer';

import * as moo from 'moo';

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
export type Arg = { name: string; type: string | 'undefined' } & ILocation;
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
export type Defcap = {
  defcap: string;
  args: Record<string, Arg>;
} & ILocation;

/**
 * @internal
 */
export interface IState {
  stack: string[];
  namespaceName: string;
  moduleName: string;
  defunName: string;
  defcapName: string;
  argName: string;
}

/**
 * @internal
 */
export type Module = {
  name: string;
  namespace: string;
  defuns: Record<string, Defun>;
  defcaps: Record<string, Defcap>;
} & ILocation;
/**
 * @internal
 */
export type Output = Record<string, Module>;

/**
 * @internal
 */

export function parser(contract: string, logger: ILogger): Output {
  lexer.reset(contract);

  let token: moo.Token | undefined = undefined;
  const state: IState = {
    stack: [],
    namespaceName: '',
    moduleName: '',
    defcapName: '',
    defunName: '',
    argName: '',
  } as IState;

  const KW_NAMESPACE: 'namespace' = 'namespace';
  const KW_MODULE: 'module' = 'module';
  const KW_DEFUN: 'defun' = 'defun';
  const KW_DEFCAP: 'defcap' = 'defcap';
  const KW_ATOM: 'atom' = 'atom';
  const STACK_DEFUN_TYPE: 'defun_type' = 'defun_type';
  const STACK_ARGS_TYPE: 'args_type' = 'args_type';
  const STACK_ARGS: 'args' = 'args';

  const lastThreeTokens: [
    moo.Token | undefined,
    moo.Token | undefined,
    moo.Token | undefined,
  ] = [undefined, undefined, undefined];

  const output: Output = {} as Output;
  while ((token = lexer.next())) {
    lastThreeTokens.shift();
    lastThreeTokens.push(token);
    switch (token.type) {
      case KW_NAMESPACE:
        state.stack.push(KW_NAMESPACE);
        logger('========================');
        logger(`=== push ${KW_NAMESPACE}`);
        logger('========================');
        break;
      case KW_DEFCAP:
        state.stack.push(KW_DEFCAP);
        logger('========================');
        logger(`=== push ${KW_DEFCAP}`);
        logger('========================');
        break;

      case KW_MODULE:
        state.stack.push(KW_MODULE);
        logger('========================');
        logger(`=== push ${KW_MODULE}`);
        logger('========================');
        break;

      case KW_ATOM:
        if (state.stack.includes(STACK_DEFUN_TYPE)) {
          logger('output: defun_type', token.value);
          output[state.moduleName].defuns[state.defunName].returnType =
            token.value;
          logger(`pop ${STACK_DEFUN_TYPE}`);
          state.stack.pop();
          break;
        }

        if (
          state.stack.includes(STACK_ARGS_TYPE) &&
          state.stack.includes(KW_DEFUN)
        ) {
          logger('output: adding defun args type', token.value);
          output[state.moduleName].defuns[state.defunName].args[
            state.argName
          ].type = token.value;
          logger(`pop ${STACK_ARGS_TYPE}`);
          state.stack.pop();
          break;
        }

        if (
          state.stack.includes(STACK_ARGS_TYPE) &&
          state.stack.includes(KW_DEFCAP)
        ) {
          logger(`output: adding ${KW_DEFCAP} args type`, token.value);
          output[state.moduleName].defcaps[state.defcapName].args[
            state.argName
          ].type = token.value;
          logger(`pop ${STACK_ARGS_TYPE}`);
          state.stack.pop();
          break;
        }

        if (
          state.stack.includes(KW_MODULE) &&
          !state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS) &&
          state.moduleName === ''
        ) {
          logger('output: adding module', token.value);
          // module
          state.moduleName = token.value;
          output[token.value] = {
            name: token.value,
            namespace: state.namespaceName,
            defuns: {},
            defcaps: {},
            line: token.line,
            col: token.col,
          };
        }

        if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFCAP) &&
          state.defcapName === '' &&
          !state.stack.includes(STACK_ARGS)
        ) {
          // defcap
          if (output[state.moduleName].defcaps[token.value] === undefined) {
            logger('output: adding defcapName', token.value);
            output[state.moduleName].defcaps[token.value] = {
              defcap: token.value,
              args: {},
              line: token.line,
              col: token.col,
            };
          }
          state.defcapName = token.value;
          continue;
        }

        if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFUN) &&
          state.defunName === '' &&
          !state.stack.includes(STACK_ARGS)
        ) {
          // module, defun
          if (output[state.moduleName].defuns[token.value] === undefined) {
            state.defunName = token.value;
            const method: string = token.value;
            const returnType: 'undefined' = 'undefined';
            output[state.moduleName].defuns[method] = {
              method,
              returnType,
              line: token.line,
              col: token.col,
              args: {},
            };
          }
        } else if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFUN) &&
          state.stack.includes(STACK_ARGS)
        ) {
          const { line, col } = token;
          output[state.moduleName].defuns[state.defunName].args[token.value] = {
            line,
            col,
            name: token.value,
            type: 'undefined',
          };
        } else if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFUN) &&
          state.defunName === '' &&
          !state.stack.includes(STACK_ARGS)
        ) {
          if (output[state.moduleName].defuns[token.value] === undefined) {
            state.defunName = token.value;
            const method: string = token.value;
            output[state.moduleName].defuns[method] = {
              method,
              returnType: 'undefined',
              line: token.line,
              col: token.col,
              args: {},
            };
          }
        } else if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFUN) &&
          state.stack.includes(STACK_ARGS)
        ) {
          output[state.moduleName].defuns[state.defunName].args[token.value] = {
            name: token.value,
            type: 'undefined',
            line: token.line,
            col: token.col,
          };
        }

        if (
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFCAP) &&
          state.stack.includes(STACK_ARGS) &&
          state.defcapName !== ''
        ) {
          logger(
            `output: adding ${STACK_ARGS} for ${state.defcapName}, ${token.value}`,
          );
          output[state.moduleName].defcaps[state.defcapName].args[token.value] =
            {
              name: token.value,
              type: 'undefined',
              line: token.line,
              col: token.col,
            };
        }

        break;
      case 'colon':
        if (
          state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS) &&
          lastThreeTokens[1]!.type === 'atom'
        ) {
          // in defun, but not in args
          // last one is atom
          logger('========================');
          logger(`=== push ${STACK_DEFUN_TYPE}`);
          logger('========================');
          state.stack.push(STACK_DEFUN_TYPE);
          break;
        }

        if (
          state.stack.includes(STACK_ARGS) &&
          lastThreeTokens[1]!.type === 'atom'
        ) {
          // in args
          // last one is atom
          state.stack.push(STACK_ARGS_TYPE);
          state.argName = lastThreeTokens[1]!.value;
          logger('========================');
          logger(`=== push ${STACK_ARGS_TYPE}`);
          logger('========================');
          break;
        }

        break;
      case KW_DEFUN:
        if (state.stack.includes(KW_MODULE)) {
          state.stack.push(KW_DEFUN);
          logger('========================');
          logger(`=== push ${KW_DEFUN}`);
          logger('========================');
        }
        break;

      case 'lparen':
        if (
          state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS)
        ) {
          state.stack.push(STACK_ARGS);
          logger('========================');
          logger(`=== push ${STACK_ARGS} for ${KW_DEFUN}`);
          logger('========================');
        }
        if (
          state.stack.includes(KW_DEFCAP) &&
          !state.stack.includes(STACK_ARGS)
        ) {
          state.stack.push(STACK_ARGS);
          logger(`push ${STACK_ARGS} for ${KW_DEFCAP}`);
        }
        break;
      case 'rparen':
        if (state.stack.includes(STACK_ARGS)) {
          // pop STACK_ARGS
          logger(`pop ${STACK_ARGS}`);
          logger('popping', state.stack[state.stack.length - 1]);
          state.stack.pop();
          // pop KW_DEFUN
          logger(`pop ${KW_DEFUN}`);
          logger('popping', state.stack[state.stack.length - 1]);
          state.stack.pop();
          // remove current defunName
          state.defunName = '';
          state.defcapName = '';
        }
        break;
      case 'symbol':
        state.namespaceName = token.value.split("'")[1];
        break;

      default:
        break;
    }
    logger('token', token);
    logger('state', state);
    logger('output', JSON.stringify(output, null, 2));
  }
  return output;
}
