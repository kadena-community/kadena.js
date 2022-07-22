"use strict";
exports.__esModule = true;
exports.lexer = void 0;
var moo = require("moo");
var fs_1 = require("fs");
var path_1 = require("path");
exports.lexer = moo.compile({
    name: {
        match: /[a-zA-Z]+/,
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
            KW_WITH_CAPABILITY: 'with-capability'
        })
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
    string: /"(?:[^"\\]|\\.|\\\n)*"/,
    newlineEscape: {
        match: /[\\|\\\\][\n]\s*/,
        lineBreaks: true
    },
    singleQuote: /'/,
    doubleQuote: /"/,
    plus: '+',
    number: /-?\d+/,
    colon: ':',
    equals: '=',
    comment: /;;?.*/,
    module: /\'[a-zA-Z_-]+/,
    TYPED_KEYWORD: /[a-zA-Z-_]+:[a-zA-Z-_]+/,
    guard: /@[a-zA-Z-_]+/,
    "var": /[a-zA-Z-_-]+/,
    gt: '>',
    lt: '<',
    float: /-?\d+\.\d+/,
    dot: '.',
    NOT_IS: /!=/,
    NL: { match: /\n/, lineBreaks: true },
    CATCHALL: { match: /.+/, value: function (str) { return str; } }
});
exports.lexer.reset((0, fs_1.readFileSync)((0, path_1.join)(__dirname, './tests/coin.contract.pact'), 'utf8'));
var token = undefined;
while ((token = exports.lexer.next())) {
    console.log(token);
}
