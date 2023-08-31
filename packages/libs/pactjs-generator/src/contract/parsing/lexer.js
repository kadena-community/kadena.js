'use strict';
exports.__esModule = true;
exports.getLexerOutput =
  exports.getModuleAndMethods =
  exports.filterFlattenWrap =
  exports.wrap =
  exports.flattenRecursive =
  exports.lexer =
    void 0;
var moo = require('moo');
/**
 * @internal
 */
exports.lexer = moo.compile({
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
  string: { match: /"(?:[^"\\]|\\.|\\\n)*"/, lineBreaks: true },
  ws: /[ \t]+/,
  nl: { match: /\n/, lineBreaks: true },
});
/**
 * @internal
 */
function flattenRecursive(arr) {
  return arr.reduce(function (acc, cur) {
    if (Array.isArray(cur)) {
      return acc.concat(flattenRecursive(cur));
    }
    return acc.concat(cur);
  }, []);
}
exports.flattenRecursive = flattenRecursive;
/**
 * @internal
 */
var wrap = function (type) {
  return function (a) {
    return {
      type: type,
      value: a,
    };
  };
};
exports.wrap = wrap;
/**
 * @internal
 */
var filterFlattenWrap = function (type) {
  return function (a) {
    return (0, exports.wrap)(type)(flattenRecursive(a).filter(Boolean));
  };
};
exports.filterFlattenWrap = filterFlattenWrap;
/**
 * @internal
 */
function getModuleAndMethods(contract, logger) {
  exports.lexer.reset(contract);
  var token = undefined;
  var state = {
    stack: [],
    moduleName: '',
    defunName: '',
    argName: '',
  };
  var KW_MODULE = 'module';
  var KW_DEFUN = 'defun';
  var KW_ATOM = 'atom';
  var STACK_DEFUN_TYPE = 'defun_type';
  var STACK_ARGS_TYPE = 'args_type';
  var STACK_ARGS = 'args';
  var lastThreeTokens = [undefined, undefined, undefined];
  var output = {};
  while ((token = exports.lexer.next())) {
    lastThreeTokens.shift();
    lastThreeTokens.push(token);
    logger(token);
    switch (token.type) {
      case KW_MODULE:
        state.stack.push(KW_MODULE);
        logger('push '.concat(KW_MODULE));
        break;
      case KW_ATOM:
        if (state.stack.includes(STACK_DEFUN_TYPE)) {
          output[state.moduleName].defuns[state.defunName].returnType =
            token.value;
          logger('pop '.concat(STACK_DEFUN_TYPE));
          state.stack.pop();
          break;
        }
        if (state.stack.includes(STACK_ARGS_TYPE)) {
          output[state.moduleName].defuns[state.defunName].args[
            state.argName
          ].type = token.value;
          logger('pop '.concat(STACK_ARGS_TYPE));
          state.stack.pop();
          break;
        }
        if (
          state.stack.includes(KW_MODULE) &&
          !state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS)
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
          state.stack.includes(KW_MODULE) &&
          state.stack.includes(KW_DEFUN) &&
          state.defunName === '' &&
          !state.stack.includes(STACK_ARGS)
        ) {
          // module, defun
          if (output[state.moduleName].defuns[token.value] === undefined) {
            state.defunName = token.value;
            var method = token.value;
            var returnType = 'undefined';
            output[state.moduleName].defuns[method] = {
              method: method,
              returnType: returnType,
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
          var line = token.line,
            col = token.col;
          output[state.moduleName].defuns[state.defunName].args[token.value] = {
            line: line,
            col: col,
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
            var method = token.value;
            output[state.moduleName].defuns[method] = {
              method: method,
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
        break;
      case 'colon':
        if (
          state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS) &&
          lastThreeTokens[1].type === 'atom'
        ) {
          // in defun, but not in args
          // last one is atom
          logger('push '.concat(STACK_DEFUN_TYPE));
          state.stack.push(STACK_DEFUN_TYPE);
          break;
        }
        if (
          state.stack.includes(STACK_ARGS) &&
          lastThreeTokens[1].type === 'atom'
        ) {
          // in args
          // last one is atom
          state.stack.push(STACK_ARGS_TYPE);
          state.argName = lastThreeTokens[1].value;
          logger('push '.concat(STACK_ARGS_TYPE));
          break;
        }
        break;
      case KW_DEFUN:
        if (state.stack.includes(KW_MODULE)) {
          state.stack.push(KW_DEFUN);
          logger('push '.concat(KW_DEFUN));
        }
        break;
      case 'lparen':
        if (
          state.stack.includes(KW_DEFUN) &&
          !state.stack.includes(STACK_ARGS)
        ) {
          state.stack.push(STACK_ARGS);
          logger('push '.concat(STACK_ARGS));
        }
        break;
      case 'rparen':
        if (state.stack.includes(STACK_ARGS)) {
          // pop STACK_ARGS
          logger('pop '.concat(STACK_ARGS));
          logger('popping', state.stack[state.stack.length - 1]);
          state.stack.pop();
          // pop KW_DEFUN
          logger('pop '.concat(KW_DEFUN));
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
exports.getModuleAndMethods = getModuleAndMethods;
var getLexerOutput = function (contract, logger) {
  if (logger === void 0) {
    logger = function () {};
  }
  exports.lexer.reset(contract);
  var token = undefined;
  var returnValue = [];
  while ((token = exports.lexer.next())) {
    logger(token);
    returnValue.push(token);
  }
  return returnValue;
};
exports.getLexerOutput = getLexerOutput;
