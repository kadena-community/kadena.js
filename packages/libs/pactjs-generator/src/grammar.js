// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const lexer = require('./lexer.js').lexer;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "input", "symbols": ["module"], "postprocess": id},
    {"name": "module", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), (lexer.has("KW_MODULE") ? {type: "KW_MODULE"} : KW_MODULE), (lexer.has("WS") ? {type: "WS"} : WS), (lexer.has("name") ? {type: "name"} : name), (lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "expression", "symbols": ["moduledefinition"]},
    {"name": "expression", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), (lexer.has("method") ? {type: "method"} : method), "arguments", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "expression$ebnf$1", "symbols": ["expression"]},
    {"name": "expression$ebnf$1", "symbols": ["expression$ebnf$1", "expression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), (lexer.has("method") ? {type: "method"} : method), "arguments", "expression$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "arguments$ebnf$1", "symbols": [(lexer.has("TYPED_KEYWORD") ? {type: "TYPED_KEYWORD"} : TYPED_KEYWORD)]},
    {"name": "arguments$ebnf$1", "symbols": ["arguments$ebnf$1", (lexer.has("TYPED_KEYWORD") ? {type: "TYPED_KEYWORD"} : TYPED_KEYWORD)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "arguments", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen), "arguments$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen)]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
