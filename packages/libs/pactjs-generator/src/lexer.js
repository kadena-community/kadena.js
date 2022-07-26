"use strict";
exports.__esModule = true;
var moo = require("moo");
exports["default"] = moo.compile({
    LPAREN: '(',
    RPAREN: ')',
    LCURLY: '{',
    RCURLY: '}',
    COMMENT: /;;?.*/,
    COMMA: ',',
    WS: { match: /[ \t\n]+/, lineBreaks: true },
    IDENTIFIER: /[a-zA-Z0-9.@\[\]\-=*+':><!_]+/,
    // IDENTIFIER: {
    //   match: /[a-zA-Z0-9.@\[\]\-=*+':><!_]+/,
    //   type: moo.keywords({
    //     KW_BLESS: 'bless',
    //     KW_DEFCONST: 'defconst',
    //     KW_DEFPACT: 'defpact',
    //     KW_DEFSCHEMA: 'defschema',
    //     KW_DEFTABLE: 'deftable',
    //     KW_DEFUN: 'defun',
    //     KW_DEFCAP: 'defcap',
    //     KW_FALSE: 'false',
    //     KW_IMPLEMENTS: 'implements',
    //     KW_INTERFACE: 'interface',
    //     KW_LET: 'let',
    //     KW_LET_STAR: 'let*',
    //     KW_LAMBDA: 'lambda',
    //     KW_MODULE: 'module',
    //     KW_STEP: 'step',
    //     KW_STEP_WITH_ROLLBACK: 'step-with-rollback',
    //     KW_TRUE: 'true',
    //     KW_USE: 'use',
    //     KW_COND: 'cond',
    //     KW_WITH_CAPABILITY: 'with-capability',
    //   }),
    // },
    STRING: { match: /"(?:[^"\\]|\\.|\\\n)*"/, lineBreaks: true }
});
