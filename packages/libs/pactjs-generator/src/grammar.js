// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const lexer = require('./lexer.js').default;
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["expression"]},
    {"name": "expression", "symbols": [(lexer.has("LPAREN") ? {type: "LPAREN"} : LPAREN), "maybeWS", (lexer.has("IDENTIFIER") ? {type: "IDENTIFIER"} : IDENTIFIER), (lexer.has("WS") ? {type: "WS"} : WS), "expression", (lexer.has("WS") ? {type: "WS"} : WS), (lexer.has("RPAREN") ? {type: "RPAREN"} : RPAREN)]},
    {"name": "maybeWS", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]},
    {"name": "maybeWS", "symbols": []}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
