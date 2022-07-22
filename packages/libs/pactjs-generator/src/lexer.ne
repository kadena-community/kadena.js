@{%
  const lexer = require('./lexer.js').lexer;
%}

@lexer lexer

input
  -> module {% id %}

module
  -> %lparen %KW_MODULE %WS %name %WS


expression
  -> moduledefinition
  | %lparen %method arguments %rparen
  | %lparen %method arguments expression:+ %rparen


arguments
  -> %lparen %TYPED_KEYWORD:+ %rparen
