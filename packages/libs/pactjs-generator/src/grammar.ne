@{%
  const lexer = require('./lexer.js').default;
%}

@lexer lexer

main -> expression

expression -> %LPAREN maybeWS %IDENTIFIER %WS expression %WS %RPAREN

maybeWS -> %WS | null
