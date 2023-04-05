// javascript port of ./Lisp/Lexer.x
/*
$lower = [ a-z ]
$digit = [ 0-9 ]
$alpha = [a-zA-Z]
$psymbol = [\%\#\+\-\_\&\$\@\<\>\=\^\?\*\!\|\/\~]
$special = [\.\;\,\$\|\*\+\?\#\~\-\{\}\(\)\[\]\^\/]
@ident = [$alpha $psymbol][$alpha $digit $psymbol]*
@integer = [\-]?[$digit]+
@singletick = [\'][$alpha][$alpha $digit \- \_]*
@comment = [\;][.]*[\n]
@tc = expect\-typechecks
@tcfail = expect\-typecheck\-failure
@steprb = step\-with\-rollback
*/

exports.lower = /[a-z]/;
exports.digit = /[0-9]/;
exports.alpha = /[a-zA-Z]/;
exports.psymbol = /[\%\#\+\-\_\&\$\@\<\>\=\^\?\*\!\|\/\~]/;
exports.special = /[\.\;\,\$\|\*\+\?\#\~\-\{\}\(\)\[\]\^\/]/;
exports.ident = new RegExp(
  `[${exports.alpha.source}${exports.psymbol.source}][${exports.alpha.source}${exports.digit.source}${exports.psymbol.source}]*`,
);
exports.integer = new RegExp(`[\\-]?[${exports.digit.source}]+`);
exports.singletick = new RegExp(
  `[\\'][${exports.alpha.source}][${exports.alpha.source}${exports.digit.source}\\-\\_]*`,
);
exports.comment = new RegExp(`[\\;][.]*[\\n]`);
exports.tc = new RegExp(`expect\\-typechecks`);
exports.tcfail = new RegExp(`expect\\-typecheck\\-failure`);
exports.steprb = new RegExp(`step\\-with\\-rollback`);

/*
tokens :-
    @comment;
    $white+;
    -- Keywords
    let\*        { token TokenLet }
    let          { token TokenLet }
    if           { token TokenIf }
    defun        { token TokenDefun }
    defcap       { token TokenDefCap }
    defconst     { token TokenDefConst }
    defschema    { token TokenDefSchema }
    deftable     { token TokenDefTable }
    defcap       { token TokenDefCap }
    defpact      { token TokenDefPact }
    defproperty  { token TokenDefProperty }
    interface    { token TokenInterface }
    module       { token TokenModule }
    bless        { token TokenBless }
    implements   { token TokenImplements }
    use          { token TokenImport }
    true         { token TokenTrue }
    false        { token TokenFalse }
    keyGov       { token TokenKeyGov }
    capGov       { token TokenCapGov }
    lambda       { token TokenLambda }

    and          { token TokenAnd }
    or           { token TokenOr }
    load         { token TokenLoad }
    \@doc        { token TokenDocAnn }
    \@model      { token TokenModelAnn}
    \@event      { token TokenEventAnn }
    \@managed    { token TokenManagedAnn}
    @steprb      { token TokenStepWithRollback}
    step         { token TokenStep }
    @tc          { token TokenTypechecks }
    @tcfail      { token TokenTypecheckFailure }
    -- at           { token TokenObjAccess }
    -- remove       { token TokenObjRemove }
    try          { token TokenTry }
    error        { token TokenError }
    progn        { token TokenBlockIntro }
    suspend      { token TokenSuspend }

    @integer     { emit TokenNumber }

    @singletick  { emit TokenSingleTick }
    \(           { token TokenOpenParens }
    \)           { token TokenCloseParens }
    \{           { token TokenOpenBrace }
    \}           { token TokenCloseBrace }
    \[           { token TokenOpenBracket }
    \]           { token TokenCloseBracket }
    \,           { token TokenComma }
    \.           { token TokenDot }
    \:\=         { token TokenBindAssign }
    \:\:         { token TokenDynAcc }
    \:           { token TokenColon }
    -- \=           { token TokenEq }
    -- \!\=         { token TokenNeq }
    -- \>\=         { token TokenGEQ }
    -- \>           { token TokenGT }
    -- \<\=         { token TokenLEQ }
    -- \<           { token TokenLT }
    -- \+           { token TokenPlus }
    -- \-           { token TokenMinus }
    -- \*           { token TokenMult }
    -- \/           { token TokenDiv }
    -- \&           { token TokenBitAnd }
    -- \|           { token TokenBitOr }
    -- \~           { token TokenBitComplement }
    \"           { stringLiteral }
    -- \^           { token TokenPow }
    @ident       { emit TokenIdent }
*/

/*
  TokenLet -> "let"
  TokenIf -> "if"
  TokenLambda -> "lambda"
  TokenTry -> "try"
  TokenError -> "error"
  TokenModule -> "module"
  TokenKeyGov -> "keyGov"
  TokenCapGov -> "capGov"
  TokenInterface -> "interface"
  TokenImport -> "use"
  TokenStep -> "step"
  TokenStepWithRollback -> "step-with-rollback"
  TokenDefun -> "defun"
  TokenDefConst -> "defconst"
  TokenDefCap -> "defcap"
  TokenDefPact -> "defpact"
  TokenDefSchema -> "defschema"
  TokenDefProperty -> "defproperty"
  TokenDefTable -> "deftable"
  TokenDocAnn -> "@doc"
  TokenEventAnn -> "@event"
  TokenManagedAnn ->  "@managed"
  TokenModelAnn -> "@model"
  TokenBless -> "bless"
  TokenImplements -> "implements"
  TokenOpenBrace -> "{"
  TokenCloseBrace -> "}"
  TokenOpenParens -> "("
  TokenCloseParens -> ")"
  TokenOpenBracket -> "["
  TokenCloseBracket -> "]"
  TokenComma -> ","
  TokenColon -> ":"
  TokenDot -> "."
  TokenBindAssign -> ":="
  TokenDynAcc -> "::"
  TokenEq -> "="
  TokenNeq -> "!="
  TokenGT -> ">"
  TokenGEQ -> ">="
  TokenLT -> "<"
  TokenLEQ -> "<="
  TokenPlus -> "+"
  TokenMinus -> "-"
  TokenMult -> "*"
  TokenDiv -> "/"
  TokenPow -> "^"
  TokenBitAnd -> "&"
  TokenBitOr -> "|"
  TokenBitComplement -> "~"
  TokenBlockIntro -> "progn"
  TokenAnd -> "and"
  TokenOr -> "or"
  TokenIdent t -> "ident<" <> t <> ">"
  TokenNumber n -> "number<" <> n <> ">"
  TokenSingleTick s -> "\'" <> s
  TokenString s -> "\"" <> s <> "\""
  TokenTrue -> "true"
  TokenFalse -> "false"
  TokenEOF -> "EOF"
  TokenSuspend -> "suspend"
  TokenLoad -> "load"
  TokenTypechecks -> "expect-typechecks"
  TokenTypecheckFailure -> "expect-typecheck-failure"
*/

exports.tokens = {
  comment: exports.comment,
  white: /[ \t]+/,
  // Keywords
  'let*': 'let',
  let: 'let',
  if: 'if',
  defun: 'defun',
  defcap: 'defcap',
  defconst: 'defconst',
  defschema: 'defschema',
  deftable: 'deftable',
  defcap: 'defcap',
  defpact: 'defpact',
  defproperty: 'defproperty',
  interface: 'interface',
  module: 'module',
  bless: 'bless',
  implements: 'implements',
  use: 'use',
  true: 'true',
  false: 'false',
  keyGov: 'keyGov',
  capGov: 'capGov',
  lam: 'lambda',

  and: 'and',
  or: 'or',
  load: 'load',
  docAnn: '@doc',
  modelAnn: '@model',
  eventAnn: '@event',
  managedAnn: '@managed',
  steprb: exports.steprb,
  step: 'step',
  tc: exports.tc,
  tcfail: exports.tcfail,
  // at: "@",
  // remove: "remove",
  try: 'try',
  err: 'error',
  progn: 'progn',
  suspend: 'suspend',

  integer: exports.integer,
  singletick: exports.singletick,

  openParens: '(',
  closeParens: ')',
  openBrace: '{',
  closeBrace: '}',
  openBracket: '[',
  closeBracket: ']',
  comma: ',',
  dot: '.',
  bindAssign: ':=',
  dynAcc: '::',
  colon: ':',
  eq: '=',
  neq: '!=',
  geq: '>=',
  gt: '>',
  leq: '<=',
  lt: '<',
  plus: '+',
  minus: '-',
  mult: '*',
  div: '/',
  bitAnd: '&',
  bitOr: '|',
  bitComplement: '~',
  // stringLiteral: "\"",
  STR: /"(?:\\["\\]|[^\n"\\])*"/,
  pow: '^',

  // Literals
  ident: exports.ident,
};
