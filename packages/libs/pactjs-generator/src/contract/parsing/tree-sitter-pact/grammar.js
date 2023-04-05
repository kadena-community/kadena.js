/*
chokidar ./lexer.js ./grammar.js ./corpus/statements.txt --initial -c "printf '\33c\e[3J' && tree-sitter generate && tree-sitter test"
*/
const clojure = require('tree-sitter-clojure/grammar');
const { ident, tokens } = require('./lexer');

// javascript port of ./Lisp/Parser.y

module.exports = grammar(
  // clojure,
  {
    name: 'pact',
    // extras: ($) => [],

    rules: {
      // Program :: { [ParsedTopLevel] }
      //   : ProgramList { reverse $1 }
      // Program: ($) => $.ProgramList,

      // ProgramList :: { [ParsedTopLevel] }
      //   : ProgramList TopLevel { $2:$1 }
      //   | {- empty -} { [] }
      // ProgramList: ($) => optional(seq($.ProgramList, $.TopLevel)),

      // TopLevel :: { ParsedTopLevel }
      //   : Module { TLModule $1 }
      //   | Interface { TLInterface $1 }
      //   | Expr { TLTerm $1 }
      TopLevel: ($) => choice($.Module, $.Interface, $.Expr),

      // Governance :: { Governance Text }
      //   : StringRaw { Governance (Left (KeySetName $1))}
      //   | IDENT { Governance (Right (getIdent $1))}
      Governance: ($) => choice($.StringRaw, ident),

      // StringRaw :: { Text }
      //  : STR  { getStr $1 }
      //  | TICK { getTick $1 }
      StringRaw: ($) => choice($.STR, $.TICK),

      // Module :: { ParsedModule }
      //   : '(' module IDENT Governance MDocOrModuleModel ExtOrDefs ')'
      //     { Module (ModuleName (getIdent $3) Nothing) $4 (reverse (rights $6)) (NE.fromList (reverse (lefts $6))) (fst $5) (snd $5)}
      Module: ($) =>
        seq(
          '(',
          'module',
          ident,
          $.Governance,
          $.MDocOrModuleModel,
          $.ExtOrDefs,
          ')',
        ),

      // Interface :: { ParsedInterface }
      // : '(' interface IDENT MDocOrModel IfDefs ')'
      //   { Interface (ModuleName (getIdent $3) Nothing) (reverse $5) (fst $4) (snd $4) }
      Interface: ($) =>
        seq('(', 'interface', ident, $.MDocOrModuleModel, $.IfDefs, ')'),

      // MDocOrModuleModel :: { (Maybe Text, [DefProperty SpanInfo])}
      //   : DocAnn ModuleModel { (Just $1, $2)}
      //   | ModuleModel DocAnn { (Just $2, $1) }
      //   | DocAnn { (Just $1, [])}
      //   | ModuleModel { (Nothing, $1)}
      //   | DocStr { (Just $1, []) }
      //   | {- empty -} { (Nothing, []) }
      MDocOrModuleModel: ($) =>
        optional(
          choice(
            seq($.DocAnn, $.ModuleModel),
            seq($.ModuleModel, $.DocAnn),
            $.DocAnn,
            $.ModuleModel,
            $.DocStr,
          ),
        ),
      //   ModuleModel :: { [DefProperty SpanInfo] }
      //   : modelAnn '[' DefProperties ']' { reverse $3 }
      ModuleModel: ($) => seq('modelAnn', '[', $.DefProperties, ']'),

      // DefProperties :: { [DefProperty SpanInfo] }
      //   : DefProperties DefProperty { $2:$1 }
      //   | {- empty -} { [] }
      DefProperties: ($) => optional(seq($.DefProperties, $.DefProperty)),

      // DefProperty :: { DefProperty SpanInfo }
      //   : '(' defprop IDENT DPropArgList ')' { DefProperty (getIdent $3) (fst $4) (snd $4) }
      DefProperty: ($) => seq('(', 'defprop', ident, $.DPropArgList, ')'),

      // -- This rule seems gnarly, but essentially
      // -- happy needs to resolve whether the arglist is present or not
      // DPropArgList
      //   : '(' IDENT ':' Type ArgList ')' Expr { (Arg (getIdent $2) $4 : reverse $5, $7) }
      //   | '(' SExpr ')' { ([], $2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      DPropArgList: ($) =>
        choice(
          seq('(', ident, ':', $.Type, $.ArgList, ')', $.Expr),
          seq('(', $.SExpr, ')'),
        ),

      // Exts :: { [ExtDecl] }
      //   : Exts Ext { $2:$1 }
      //   | {- empty -} { [] }
      Exts: ($) => optional(seq($.Exts, $.Ext)),

      // Ext :: { ExtDecl }
      //   : '(' import ModQual ImportList ')' { ExtImport (Import (mkModName $3) Nothing $4)  }
      //   | '(' implements ModQual ')' { ExtImplements (mkModName $3) }
      //   | '(' bless StringRaw ')' { ExtBless $3 }
      Ext: ($) =>
        choice(
          seq('(', 'import', $.ModQual, $.ImportList, ')'),
          seq('(', 'implements', $.ModQual, ')'),
          seq('(', 'bless', $.StringRaw, ')'),
        ),

      // Defs :: { [ParsedDef] }
      //   : Defs Def { $2:$1 }
      //   | Def { [$1] }
      Defs: ($) => choice(seq($.Defs, $.Def), $.Def),

      // ExtOrDefs :: { [Either (Def SpanInfo) ExtDecl] }
      //   : ExtOrDefs Def { (Left $2):$1 }
      //   | ExtOrDefs Ext { (Right $2) : $1 }
      //   | Def { [Left $1] }
      //   | Ext { [Right $1] }
      ExtOrDefs: ($) =>
        choice(seq($.ExtOrDefs, $.Def), seq($.ExtOrDefs, $.Ext), $.Def, $.Ext),

      // Def :: { ParsedDef }
      //   : '(' Defun ')' { Dfun ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' DefConst ')' { DConst ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' Defcap ')'  { DCap ($2 (combineSpan (_ptInfo $1) (_ptInfo $3)))  }
      //   | '(' Defschema ')' { DSchema ($2 (combineSpan (_ptInfo $1) (_ptInfo $3)))  }
      //   | '(' Deftable ')' { DTable ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' DefPact ')' { DPact ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      Def: ($) =>
        choice(
          seq('(', $.Defun, ')'),
          seq('(', $.DefConst, ')'),
          seq('(', $.Defcap, ')'),
          seq('(', $.Defschema, ')'),
          seq('(', $.Deftable, ')'),
          seq('(', $.DefPact, ')'),
        ),

      // IfDefs :: { [ParsedIfDef] }
      //   : IfDefs IfDef { $2:$1 }
      //   | IfDef { [$1] }
      IfDefs: ($) => choice(seq($.IfDefs, $.IfDef), $.IfDef),

      // IfDef :: { ParsedIfDef }
      //   : '(' IfDefun ')' { IfDfun ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' DefConst ')' { IfDConst ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' IfDefCap ')'{ IfDCap ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' Defschema ')' { IfDSchema ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      //   | '(' IfDefPact ')' { IfDPact ($2 (combineSpan (_ptInfo $1) (_ptInfo $3))) }
      IfDef: ($) =>
        choice(
          seq('(', $.IfDefun, ')'),
          seq('(', $.DefConst, ')'),
          seq('(', $.IfDefCap, ')'),
          seq('(', $.Defschema, ')'),
          seq('(', $.IfDefPact, ')'),
        ),

      // -- ident = $2,
      // IfDefun :: { SpanInfo -> IfDefun SpanInfo }
      //   : defun IDENT MTypeAnn '(' MArgs ')' MDocOrModel
      //     { IfDefun (getIdent $2) (reverse $5) $3 (fst $7) (snd $7) }
      IfDefun: ($) =>
        seq(tokens.defun, ident, $.MTypeAnn, '(', $.MArgs, ')', $.MDocOrModel),

      // IfDefCap :: { SpanInfo -> IfDefCap SpanInfo }
      //   : defcap IDENT MTypeAnn'(' MArgs ')' MDocOrModel MDCapMeta
      //     { IfDefCap (getIdent $2) (reverse $5) $3 (fst $7) (snd $7) $8 }
      IfDefCap: ($) =>
        seq(
          tokens.defcap,
          ident,
          $.MTypeAnn,
          '(',
          $.MArgs,
          ')',
          $.MDocOrModel,
          $.MDCapMeta,
        ),

      // IfDefPact :: { SpanInfo -> IfDefPact SpanInfo }
      //   : defpact IDENT MTypeAnn '(' MArgs ')' MDocOrModel
      //     { IfDefPact (getIdent $2) (reverse $5) $3 (fst $7) (snd $7) }
      IfDefPact: ($) =>
        seq(
          tokens.defpact,
          ident,
          $.MTypeAnn,
          '(',
          $.MArgs,
          ')',
          $.MDocOrModel,
        ),

      // ImportList :: { Maybe [Text] }
      //   : '[' ImportNames ']' { Just (reverse $2) }
      //   | {- empty -} { Nothing }
      ImportList: ($) => optional(seq('[', $.ImportNames, ']')),

      // ImportNames :: { [Text] }
      //   : ImportNames IDENT { (getIdent $2):$1 }
      //   | {- empty -} { [] }
      ImportNames: ($) => optional(seq($.ImportNames, ident)),

      // DefConst :: { SpanInfo -> ParsedDefConst }
      //   : defconst IDENT MTypeAnn Expr MDoc { DefConst (getIdent $2) $3 $4 $5 }
      DefConst: ($) => seq(tokens.defconst, ident, $.MTypeAnn, $.Expr, $.MDoc),

      // -- All defs
      // Defun :: { SpanInfo -> ParsedDefun }
      //   : defun IDENT MTypeAnn '(' MArgs ')' MDocOrModel Block
      //     { Defun (getIdent $2) (reverse $5) $3 $8 (fst $7) (snd $7) }
      Defun: ($) =>
        seq(
          tokens.defun,
          ident,
          $.MTypeAnn,
          '(',
          $.MArgs,
          ')',
          $.MDocOrModel,
          $.Block,
        ),

      // Defschema :: { SpanInfo -> DefSchema SpanInfo }
      //   : defschema IDENT MDocOrModel NEArgList
      //     { DefSchema (getIdent $2) (reverse $4) (fst $3) (snd $3) }
      Defschema: ($) =>
        seq(tokens.defschema, ident, $.MDocOrModel, $.NEArgList),

      // Deftable :: { SpanInfo -> DefTable SpanInfo }
      //   : deftable IDENT ':' '{' ParsedName '}' MDoc { DefTable (getIdent $2) $5 $7 }
      Deftable: ($) =>
        seq(tokens.deftable, ident, ':', '{', $.ParsedName, '}', $.MDoc),

      // Defcap :: { SpanInfo -> DefCap SpanInfo }
      //   : defcap IDENT MTypeAnn '(' MArgs ')' MDocOrModel MDCapMeta Block
      //     { DefCap (getIdent $2) (reverse $5) $3 $9 (fst $7) (snd $7) $8 }
      Defcap: ($) =>
        seq(
          tokens.defcap,
          ident,
          $.MTypeAnn,
          '(',
          $.MArgs,
          ')',
          $.MDocOrModel,
          $.MDCapMeta,
          $.Block,
        ),

      // DefPact :: { SpanInfo -> DefPact SpanInfo }
      //   : defpact IDENT MTypeAnn '(' MArgs ')' MDocOrModel Steps
      //     { DefPact (getIdent $2) $5 $3 $8 (fst $7) (snd $7) }
      DefPact: ($) =>
        seq(
          tokens.defpact,
          ident,
          $.MTypeAnn,
          '(',
          $.MArgs,
          ')',
          $.MDocOrModel,
          $.Steps,
        ),

      // Steps :: { [PactStep SpanInfo] }
      //   : Steps Step { $2:$1 }
      //   | Step { [$1] }
      Steps: ($) => choice(seq($.Steps, $.Step), $.Step),

      // Step :: { PactStep SpanInfo }
      //   : '(' step Expr MModel ')' { Step $3 $4 }
      //   | '(' steprb Expr Expr MModel ')' { StepWithRollback $3 $4 $5 }
      Step: ($) =>
        choice(
          seq('(', tokens.step, $.Expr, $.MModel, ')'),
          seq('(', tokens.steprb, $.Expr, $.Expr, $.MModel, ')'),
        ),

      // MDCapMeta :: { Maybe DCapMeta }
      //   : Managed { Just $1 }
      //   | Event { Just $1 }
      //   | {- empty -} { Nothing }
      MDCapMeta: ($) => optional(choice($.Managed, $.Event)),

      // Managed :: { DCapMeta }
      //   : managedAnn { DefManaged Nothing }
      //   | managedAnn IDENT ParsedName { DefManaged (Just (getIdent $2, $3)) }
      Managed: ($) =>
        choice(
          seq(tokens.managedAnn),
          seq(tokens.managedAnn, ident, $.ParsedName),
        ),

      // Event :: { DCapMeta }
      //   : eventAnn { DefEvent }
      Event: ($) => tokens.eventAnn,

      // MArgs :: { [MArg] }
      //   : MArgs MArg { $2:$1 }
      //   | {- empty -} { [] }
      MArgs: ($) => optional(seq($.MArgs, $.MArg)),

      // MArg :: { MArg }
      //   : IDENT ':' Type { MArg (getIdent $1) (Just $3) }
      //   | IDENT { MArg (getIdent $1) Nothing }
      MArg: ($) => choice(seq(ident, ':', $.Type), seq(ident)),

      // NEArgList :: { [Arg] }
      //   : ArgList IDENT ':' Type { (Arg (getIdent $2) $4):$1 }
      NEArgList: ($) => seq($.ArgList, ident, ':', $.Type),

      // ArgList :: { [Arg] }
      //   : ArgList IDENT ':' Type { (Arg (getIdent $2) $4):$1 }
      //   | {- empty -} { [] }
      ArgList: ($) => optional(seq($.ArgList, ident, ':', $.Type)),

      // Type :: { Type }
      //   : '[' Type ']' { TyList $2 }
      //   | module '{' ModQual '}' { TyModRef (mkModName $3) }
      //   | IDENT '{' ParsedName '}' {% objType (_ptInfo $1) (getIdent $1) $3}
      //   | AtomicType { $1 }
      Type: ($) =>
        choice(
          seq('[', $.Type, ']'),
          seq($.Module, '{', $.ModQual, '}'),
          seq(ident, '{', $.ParsedName, '}'),
          $.AtomicType,
        ),

      // AtomicType :: { Type }
      //   : IDENT {% primType (_ptInfo $1) (getIdent $1) }
      AtomicType: ($) => ident,

      // -- Annotations
      // DocAnn :: { Text }
      //   : docAnn STR { getStr $2 }
      DocAnn: ($) => seq(tokens.docAnn, $.STR),

      // DocStr :: { Text }
      //   : STR { getStr $1 }
      DocStr: ($) => $.STR,

      // ModelExprs :: { [ParsedExpr] }
      //   : ModelExprs Expr { $2:$1 }
      //   | {- empty -} { [] }
      ModelExprs: ($) => optional(seq($.ModelExprs, $.Expr)),

      // MModel :: { Maybe [Expr SpanInfo] }
      //   : ModelAnn { Just $1 }
      //   | {- empty -}  { Nothing }
      MModel: ($) => optional($.ModelAnn),

      // ModelAnn :: { [Expr SpanInfo] }
      //   : modelAnn '[' ModelExprs ']' { reverse $3 }
      ModelAnn: ($) => seq(tokens.modelAnn, '[', $.ModelExprs, ']'),

      // MDocOrModel :: { (Maybe Text, Maybe [Expr SpanInfo])}
      //   : DocAnn ModelAnn { (Just $1, Just $2)}
      //   | ModelAnn DocAnn { (Just $2, Just $1) }
      //   | DocAnn { (Just $1, Nothing)}
      //   | ModelAnn { (Nothing, Just $1)}
      //   | DocStr { (Just $1, Nothing) }
      //   | {- empty -} { (Nothing, Nothing) }
      MDocOrModel: ($) =>
        optional(
          choice(
            seq($.DocAnn, $.ModelAnn),
            seq($.ModelAnn, $.DocAnn),
            $.DocAnn,
            $.ModelAnn,
            $.DocStr,
          ),
        ),

      // MDoc :: { Maybe Text }
      //   : DocAnn { Just $1 }
      //   | DocStr { Just $1 }
      //   | {- empty -} { Nothing }
      MDoc: ($) => optional(choice($.DocAnn, $.DocStr)),

      // MTypeAnn :: { Maybe Type }
      //   : ':' Type { Just $2 }
      //   | {- empty -} { Nothing }
      MTypeAnn: ($) => optional(seq(':', $.Type)),

      // Block :: { ParsedExpr }
      //   : BlockBody { mkBlock (reverse $1)  }
      Block: ($) => seq($.BlockBody),

      // BlockBody :: { [ParsedExpr] }
      //   : BlockBody Expr { $2:$1 }
      //   | Expr { [$1] }
      BlockBody: ($) => choice(seq($.BlockBody, $.Expr), $.Expr),

      // Expr :: { ParsedExpr }
      //   : '(' SExpr ')' { $2 (combineSpan (_ptInfo $1) (_ptInfo $3)) }
      //   | Atom { $1 }
      //   | Expr '::' IDENT { DynAccess $1 (getIdent $3) (combineSpan (view termInfo $1) (_ptInfo $3)) }
      Expr: ($) =>
        choice(seq('(', $.SExpr, ')'), $.Atom, seq($.Expr, '::', ident)),

      // SExpr :: { SpanInfo -> ParsedExpr }
      //   : LamExpr { $1 }
      //   | LetExpr { $1 }
      //   | IfExpr { $1 }
      //   | TryExpr { $1 }
      //   | ErrExpr { $1 }
      //   | ProgNExpr { $1 }
      //   | GenAppExpr { $1 }
      //   | SuspendExpr { $1 }
      SExpr: ($) =>
        choice(
          $.LamExpr,
          $.LetExpr,
          $.IfExpr,
          $.TryExpr,
          $.ErrExpr,
          $.ProgNExpr,
          $.GenAppExpr,
          $.SuspendExpr,
        ),

      // List :: { ParsedExpr }
      //   : '[' ListExprs ']' { List $2 (combineSpan (_ptInfo $1) (_ptInfo $3)) }
      List: ($) => seq('[', $.ListExprs, ']'),

      // ListExprs :: { [ParsedExpr] }
      //   : Expr MCommaExpr { $1:(reverse $2) }
      //   | {- empty -} { [] }
      ListExprs: ($) => optional(seq($.Expr, $.MCommaExpr)),

      // MCommaExpr :: { [ParsedExpr] }
      //   : ',' ExprCommaSep { $2 }
      //   | AppList { $1 }
      MCommaExpr: ($) => choice(seq(',', $.ExprCommaSep), $.AppList),

      // ExprCommaSep :: { [ParsedExpr] }
      //   : ExprCommaSep ',' Expr { $3:$1 }
      //   | Expr { [$1] }
      //   -- | {- empty -} { [] }
      ExprCommaSep: ($) => choice(seq($.ExprCommaSep, ',', $.Expr), $.Expr),

      // LamExpr :: { SpanInfo -> ParsedExpr }
      //   : lam '(' LamArgs ')' Block { Lam (reverse $3) $5 }
      LamExpr: ($) => seq(tokens.lam, '(', $.LamArgs, ')', $.Block),

      // IfExpr :: { SpanInfo -> ParsedExpr }
      //   : if Expr Expr Expr { If $2 $3 $4 }
      IfExpr: ($) => seq(tokens.if, $.Expr, $.Expr, $.Expr),

      // TryExpr :: { SpanInfo -> ParsedExpr }
      //   : try Expr Expr { Try $2 $3 }
      TryExpr: ($) => seq(tokens.try, $.Expr, $.Expr),

      // SuspendExpr :: { SpanInfo -> ParsedExpr }
      //   : suspend Expr { Suspend $2 }
      SuspendExpr: ($) => seq(tokens.suspend, $.Expr),

      // ErrExpr :: { SpanInfo -> ParsedExpr }
      //   : err STR { Error (getStr $2) }
      ErrExpr: ($) => seq(tokens.err, $.STR),

      // LamArgs :: { [(Text, Maybe Type)] }
      //   : LamArgs IDENT ':' Type { (getIdent $2, Just $4):$1 }
      //   | LamArgs IDENT { (getIdent $2, Nothing):$1 }
      //   | {- empty -} { [] }
      LamArgs: ($) =>
        optional(
          choice(seq($.LamArgs, ident, ':', $.Type), seq($.LamArgs, ident)),
        ),

      // LetExpr :: { SpanInfo -> ParsedExpr }
      //   : let '(' Binders ')' Block { LetIn (NE.fromList (reverse $3)) $5 }
      LetExpr: ($) => seq(tokens.let, '(', $.Binders, ')', $.Block),

      // Binders :: { [Binder SpanInfo] }
      //   : Binders '(' IDENT MTypeAnn Expr ')' { (Binder (getIdent $3) $4 $5):$1 }
      //   | '(' IDENT MTypeAnn Expr ')' { [Binder (getIdent $2) $3 $4] }
      Binders: ($) =>
        choice(
          seq($.Binders, '(', ident, $.MTypeAnn, $.Expr, ')'),
          seq('(', ident, $.MTypeAnn, $.Expr, ')'),
        ),

      // GenAppExpr :: { SpanInfo -> ParsedExpr }
      //   : Expr AppBindList { App $1 (toAppExprList (reverse $2)) }
      GenAppExpr: ($) => seq($.Expr, $.AppBindList),

      // ProgNExpr :: { SpanInfo -> ParsedExpr }
      //   : progn BlockBody { Block (NE.fromList (reverse $2)) }
      ProgNExpr: ($) => seq(tokens.progn, $.BlockBody),

      // AppList :: { [ParsedExpr] }
      //   : AppList Expr { $2:$1 }
      //   | {- empty -} { [] }
      AppList: ($) => optional(seq($.AppList, $.Expr)),

      // AppBindList :: { [Either ParsedExpr [(Field, MArg)]] }
      //   : AppBindList Expr { (Left $2):$1 }
      //   | AppBindList BindingForm { (Right $2):$1}
      //   | {- empty -} { [] }
      AppBindList: ($) =>
        choice(seq($.AppBindList, $.Expr), seq($.AppBindList, $.BindingForm)),

      // BindingForm :: { [(Field, MArg)] }
      //   : '{' BindPairs '}' { $2 }
      BindingForm: ($) => seq('{', $.BindPairs, '}'),

      // Binding :: { ParsedExpr }
      //   : '{' BindPairs '}' BlockBody { Binding $2 $4 (_ptInfo $1)}
      Binding: ($) => seq('{', $.BindPairs, '}', $.BlockBody),

      // BindPair :: { (Field, MArg) }
      //   : STR ':=' MArg { (Field (getStr $1), $3) }
      //   | TICK ':=' MArg { (Field (getTick $1), $3) }
      BindPair: ($) =>
        choice(seq($.STR, ':=', $.MArg), seq($.TICK, ':=', $.MArg)),

      // BindPairs :: { [(Field, MArg)] }
      //   : BindPairs ',' BindPair { $3 : $1 }
      //   | BindPair { [$1] }
      BindPairs: ($) =>
        choice(seq($.BindPairs, ',', $.BindPair), seq($.BindPair)),

      // Atom :: { ParsedExpr }
      //   : Var { $1 }
      //   | Number { $1 }
      //   | String { $1 }
      //   | List { $1 }
      //   | Bool { $1 }
      //   | Operator { $1 }
      //   | Object { $1 }
      //   | '(' ')' { Constant LUnit (_ptInfo $1) }
      Atom: ($) =>
        choice(
          $.Var,
          $.Number,
          $.String,
          $.List,
          $.Bool,
          $.Operator,
          $.Object,
          seq('(', ')'),
        ),

      // Operator :: { ParsedExpr }
      //   : and { Operator AndOp (_ptInfo $1) }
      //   | or { Operator OrOp (_ptInfo $1) }
      Operator: ($) => choice(tokens.and, tokens.or),

      // Bool :: { ParsedExpr }
      //   : true { Constant (LBool True) (_ptInfo $1) }
      //   | false { Constant (LBool False) (_ptInfo $1) }
      Bool: ($) => choice(tokens.true, tokens.false),

      // TODO: is this even used?
      // BOOLEAN :: { Bool }
      //   : true { True }
      //   | false { False }
      // BOOLEAN: ($) => choice(tokens.true, tokens.false),

      // Var :: { ParsedExpr }
      //   : IDENT '.' ModQual  { Var (mkQualName (getIdent $1) $3) (_ptInfo $1) }
      //   | IDENT { Var (mkBarename (getIdent $1)) (_ptInfo $1) }
      Var: ($) => choice(seq(ident, '.', $.ModQual), ident),

      // ParsedName :: { ParsedName }
      //   : IDENT '.' ModQual { mkQualName (getIdent $1) $3 }
      //   | IDENT { mkBarename (getIdent $1) }
      ParsedName: ($) => choice(seq(ident, '.', $.ModQual), ident),

      // QualifiedName :: { QualifiedName }
      //   : IDENT '.' ModQual { mkQualName' (getIdent $1) $3 }
      QualifiedName: ($) => seq(ident, '.', $.ModQual),

      // ModQual :: { (Text, Maybe Text) }
      //   : IDENT '.' IDENT { (getIdent $1, Just (getIdent $3)) }
      //   | IDENT { (getIdent $1, Nothing) }
      ModQual: ($) => choice(seq(ident, '.', ident), ident),

      // Number :: { ParsedExpr }
      //   : NUM '.' NUM {% mkDecimal (getNumber $1) (getNumber $3) (_ptInfo $1) }
      //   | NUM { mkIntegerConstant (getNumber $1) (_ptInfo $1) }
      Number: ($) => choice(seq($.NUM, '.', $.NUM), $.NUM),

      // String :: { ParsedExpr }
      //  : STR  { Constant (LString (getStr $1)) (_ptInfo $1) }
      //  | TICK { Constant (LString (getTick $1)) (_ptInfo $1) }
      String: ($) => choice($.STR, $.TICK),

      // Object :: { ParsedExpr }
      //   : '{' ObjectBody '}' { Object $2 (combineSpan (_ptInfo $1) (_ptInfo $3)) }
      Object: ($) => seq('{', $.ObjectBody, '}'),

      // ObjectBody :: { [(Field, ParsedExpr)] }
      //   : FieldPairs { $1 }
      ObjectBody: ($) => $.FieldPairs,

      // FieldPair :: { (Field, ParsedExpr) }
      //   : STR ':' Expr { (Field (getStr $1), $3) }
      //   | TICK ':' Expr { (Field (getTick $1), $3) }
      FieldPair: ($) =>
        choice(seq($.STR, ':', $.Expr), seq($.TICK, ':', $.Expr)),

      // FieldPairs :: { [(Field, ParsedExpr)] }
      //   : FieldPairs ',' FieldPair { $3 : $1 }
      //   | FieldPair { [$1] }
      //   | {- empty -} { [] }
      FieldPairs: ($) =>
        optional(choice(seq($.FieldPairs, ',', $.FieldPair), seq($.FieldPair))),

      // Annotations

      // DocAnn :: { Text }
      //   : docAnn STR { getStr $2 }
      DocAnn: ($) => seq(tokens.docAnn, $.STR),

      // TODO literals that are terminals should be tokens?
      // STR        { PosToken (TokenString _) _ }
      STR: ($) => /"\w+/,
      // TICK       { PosToken (TokenSingleTick _) _}
      TICK: ($) => /'\w+/,
      // NUM        { PosToken (TokenNumber _) _ }
      NUM: ($) => /\d+/,
    },
  },
);
