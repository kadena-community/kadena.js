#include <tree_sitter/parser.h>

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 25
#define LARGE_STATE_COUNT 15
#define SYMBOL_COUNT 23
#define ALIAS_COUNT 0
#define TOKEN_COUNT 12
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 4
#define MAX_ALIAS_SEQUENCE_LENGTH 4
#define PRODUCTION_ID_COUNT 4

enum {
  anon_sym_LPAREN = 1,
  anon_sym_RPAREN = 2,
  sym_string = 3,
  sym_number = 4,
  anon_sym_true = 5,
  anon_sym_false = 6,
  sym_symbol = 7,
  anon_sym_module = 8,
  anon_sym_defun = 9,
  anon_sym_with_DASHcapability = 10,
  anon_sym_defpact = 11,
  sym_source = 12,
  sym_list = 13,
  sym_expression = 14,
  sym_boolean = 15,
  sym_definition = 16,
  sym_module_declaration = 17,
  sym_defun_declaration = 18,
  sym_with_capability_declaration = 19,
  sym_defpact_declaration = 20,
  aux_sym_source_repeat1 = 21,
  aux_sym_list_repeat1 = 22,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [anon_sym_LPAREN] = "(",
  [anon_sym_RPAREN] = ")",
  [sym_string] = "string",
  [sym_number] = "number",
  [anon_sym_true] = "true",
  [anon_sym_false] = "false",
  [sym_symbol] = "symbol",
  [anon_sym_module] = "module",
  [anon_sym_defun] = "defun",
  [anon_sym_with_DASHcapability] = "with-capability",
  [anon_sym_defpact] = "defpact",
  [sym_source] = "source",
  [sym_list] = "list",
  [sym_expression] = "expression",
  [sym_boolean] = "boolean",
  [sym_definition] = "definition",
  [sym_module_declaration] = "module_declaration",
  [sym_defun_declaration] = "defun_declaration",
  [sym_with_capability_declaration] = "with_capability_declaration",
  [sym_defpact_declaration] = "defpact_declaration",
  [aux_sym_source_repeat1] = "source_repeat1",
  [aux_sym_list_repeat1] = "list_repeat1",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [sym_string] = sym_string,
  [sym_number] = sym_number,
  [anon_sym_true] = anon_sym_true,
  [anon_sym_false] = anon_sym_false,
  [sym_symbol] = sym_symbol,
  [anon_sym_module] = anon_sym_module,
  [anon_sym_defun] = anon_sym_defun,
  [anon_sym_with_DASHcapability] = anon_sym_with_DASHcapability,
  [anon_sym_defpact] = anon_sym_defpact,
  [sym_source] = sym_source,
  [sym_list] = sym_list,
  [sym_expression] = sym_expression,
  [sym_boolean] = sym_boolean,
  [sym_definition] = sym_definition,
  [sym_module_declaration] = sym_module_declaration,
  [sym_defun_declaration] = sym_defun_declaration,
  [sym_with_capability_declaration] = sym_with_capability_declaration,
  [sym_defpact_declaration] = sym_defpact_declaration,
  [aux_sym_source_repeat1] = aux_sym_source_repeat1,
  [aux_sym_list_repeat1] = aux_sym_list_repeat1,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [sym_string] = {
    .visible = true,
    .named = true,
  },
  [sym_number] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_true] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_false] = {
    .visible = true,
    .named = false,
  },
  [sym_symbol] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_module] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_defun] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_with_DASHcapability] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_defpact] = {
    .visible = true,
    .named = false,
  },
  [sym_source] = {
    .visible = true,
    .named = true,
  },
  [sym_list] = {
    .visible = true,
    .named = true,
  },
  [sym_expression] = {
    .visible = true,
    .named = true,
  },
  [sym_boolean] = {
    .visible = true,
    .named = true,
  },
  [sym_definition] = {
    .visible = true,
    .named = true,
  },
  [sym_module_declaration] = {
    .visible = true,
    .named = true,
  },
  [sym_defun_declaration] = {
    .visible = true,
    .named = true,
  },
  [sym_with_capability_declaration] = {
    .visible = true,
    .named = true,
  },
  [sym_defpact_declaration] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_source_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_list_repeat1] = {
    .visible = false,
    .named = false,
  },
};

enum {
  field_args = 1,
  field_body = 2,
  field_capability = 3,
  field_name = 4,
};

static const char * const ts_field_names[] = {
  [0] = NULL,
  [field_args] = "args",
  [field_body] = "body",
  [field_capability] = "capability",
  [field_name] = "name",
};

static const TSFieldMapSlice ts_field_map_slices[PRODUCTION_ID_COUNT] = {
  [1] = {.index = 0, .length = 2},
  [2] = {.index = 2, .length = 2},
  [3] = {.index = 4, .length = 3},
};

static const TSFieldMapEntry ts_field_map_entries[] = {
  [0] =
    {field_args, 2},
    {field_name, 1},
  [2] =
    {field_body, 2},
    {field_capability, 1},
  [4] =
    {field_args, 2},
    {field_body, 3},
    {field_name, 1},
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 21,
  [22] = 22,
  [23] = 23,
  [24] = 24,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      if (eof) ADVANCE(2);
      if (lookahead == '"') ADVANCE(10);
      if (lookahead == '(') ADVANCE(3);
      if (lookahead == ')') ADVANCE(4);
      if (lookahead == '-') ADVANCE(44);
      if (lookahead == 'd') ADVANCE(20);
      if (lookahead == 'f') ADVANCE(12);
      if (lookahead == 'm') ADVANCE(33);
      if (lookahead == 't') ADVANCE(36);
      if (lookahead == 'w') ADVANCE(26);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ') SKIP(0)
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(7);
      if (lookahead != 0) ADVANCE(45);
      END_STATE();
    case 1:
      if (lookahead == '"') ADVANCE(5);
      if (lookahead != 0) ADVANCE(1);
      END_STATE();
    case 2:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 3:
      ACCEPT_TOKEN(anon_sym_LPAREN);
      END_STATE();
    case 4:
      ACCEPT_TOKEN(anon_sym_RPAREN);
      END_STATE();
    case 5:
      ACCEPT_TOKEN(sym_string);
      END_STATE();
    case 6:
      ACCEPT_TOKEN(sym_string);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 7:
      ACCEPT_TOKEN(sym_number);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(7);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 8:
      ACCEPT_TOKEN(anon_sym_true);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 9:
      ACCEPT_TOKEN(anon_sym_false);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 10:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == '"') ADVANCE(6);
      if (lookahead == '\t' ||
          lookahead == '\n' ||
          lookahead == '\r' ||
          lookahead == ' ' ||
          lookahead == '(' ||
          lookahead == ')') ADVANCE(1);
      if (lookahead != 0) ADVANCE(10);
      END_STATE();
    case 11:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == '-') ADVANCE(18);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 12:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'a') ADVANCE(29);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 13:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'a') ADVANCE(17);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 14:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'a') ADVANCE(35);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 15:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'a') ADVANCE(16);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 16:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'b') ADVANCE(27);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 17:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'c') ADVANCE(39);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'c') ADVANCE(14);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'd') ADVANCE(42);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'e') ADVANCE(24);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 21:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'e') ADVANCE(8);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 22:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'e') ADVANCE(9);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 23:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'e') ADVANCE(46);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 24:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'f') ADVANCE(34);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 25:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'h') ADVANCE(11);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 26:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'i') ADVANCE(38);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 27:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'i') ADVANCE(31);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 28:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'i') ADVANCE(40);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 29:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'l') ADVANCE(37);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 30:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'l') ADVANCE(23);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 31:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'l') ADVANCE(28);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 32:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'n') ADVANCE(47);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 33:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'o') ADVANCE(19);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 34:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'p') ADVANCE(13);
      if (lookahead == 'u') ADVANCE(32);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 35:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'p') ADVANCE(15);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 36:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'r') ADVANCE(41);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 37:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 's') ADVANCE(22);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 38:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 't') ADVANCE(25);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 39:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 't') ADVANCE(49);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 40:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 't') ADVANCE(43);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 41:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'u') ADVANCE(21);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 42:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'u') ADVANCE(30);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 43:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead == 'y') ADVANCE(48);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 44:
      ACCEPT_TOKEN(sym_symbol);
      if (('0' <= lookahead && lookahead <= '9')) ADVANCE(7);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 45:
      ACCEPT_TOKEN(sym_symbol);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 46:
      ACCEPT_TOKEN(anon_sym_module);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 47:
      ACCEPT_TOKEN(anon_sym_defun);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 48:
      ACCEPT_TOKEN(anon_sym_with_DASHcapability);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    case 49:
      ACCEPT_TOKEN(anon_sym_defpact);
      if (lookahead != 0 &&
          lookahead != '\t' &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != ' ' &&
          lookahead != '(' &&
          lookahead != ')') ADVANCE(45);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 0},
  [2] = {.lex_state = 0},
  [3] = {.lex_state = 0},
  [4] = {.lex_state = 0},
  [5] = {.lex_state = 0},
  [6] = {.lex_state = 0},
  [7] = {.lex_state = 0},
  [8] = {.lex_state = 0},
  [9] = {.lex_state = 0},
  [10] = {.lex_state = 0},
  [11] = {.lex_state = 0},
  [12] = {.lex_state = 0},
  [13] = {.lex_state = 0},
  [14] = {.lex_state = 0},
  [15] = {.lex_state = 0},
  [16] = {.lex_state = 0},
  [17] = {.lex_state = 0},
  [18] = {.lex_state = 0},
  [19] = {.lex_state = 0},
  [20] = {.lex_state = 0},
  [21] = {.lex_state = 0},
  [22] = {.lex_state = 0},
  [23] = {.lex_state = 0},
  [24] = {.lex_state = 0},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [ts_builtin_sym_end] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [sym_string] = ACTIONS(1),
    [sym_number] = ACTIONS(1),
    [anon_sym_true] = ACTIONS(1),
    [anon_sym_false] = ACTIONS(1),
    [sym_symbol] = ACTIONS(1),
    [anon_sym_module] = ACTIONS(1),
    [anon_sym_defun] = ACTIONS(1),
    [anon_sym_with_DASHcapability] = ACTIONS(1),
    [anon_sym_defpact] = ACTIONS(1),
  },
  [1] = {
    [sym_source] = STATE(24),
    [sym_list] = STATE(23),
    [aux_sym_source_repeat1] = STATE(23),
    [ts_builtin_sym_end] = ACTIONS(3),
    [anon_sym_LPAREN] = ACTIONS(5),
  },
  [2] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(4),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [aux_sym_list_repeat1] = STATE(4),
    [anon_sym_LPAREN] = ACTIONS(5),
    [anon_sym_RPAREN] = ACTIONS(7),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [3] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(3),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [aux_sym_list_repeat1] = STATE(3),
    [anon_sym_LPAREN] = ACTIONS(21),
    [anon_sym_RPAREN] = ACTIONS(24),
    [sym_string] = ACTIONS(26),
    [sym_number] = ACTIONS(26),
    [anon_sym_true] = ACTIONS(29),
    [anon_sym_false] = ACTIONS(29),
    [sym_symbol] = ACTIONS(26),
    [anon_sym_module] = ACTIONS(32),
    [anon_sym_defun] = ACTIONS(35),
    [anon_sym_with_DASHcapability] = ACTIONS(38),
    [anon_sym_defpact] = ACTIONS(41),
  },
  [4] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(3),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [aux_sym_list_repeat1] = STATE(3),
    [anon_sym_LPAREN] = ACTIONS(5),
    [anon_sym_RPAREN] = ACTIONS(44),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [5] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(20),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [6] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(21),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [7] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(16),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [8] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(12),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [9] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(5),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [10] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(11),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [11] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(6),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [12] = {
    [sym_list] = STATE(15),
    [sym_expression] = STATE(19),
    [sym_boolean] = STATE(15),
    [sym_definition] = STATE(15),
    [sym_module_declaration] = STATE(17),
    [sym_defun_declaration] = STATE(17),
    [sym_with_capability_declaration] = STATE(17),
    [sym_defpact_declaration] = STATE(17),
    [anon_sym_LPAREN] = ACTIONS(5),
    [sym_string] = ACTIONS(9),
    [sym_number] = ACTIONS(9),
    [anon_sym_true] = ACTIONS(11),
    [anon_sym_false] = ACTIONS(11),
    [sym_symbol] = ACTIONS(9),
    [anon_sym_module] = ACTIONS(13),
    [anon_sym_defun] = ACTIONS(15),
    [anon_sym_with_DASHcapability] = ACTIONS(17),
    [anon_sym_defpact] = ACTIONS(19),
  },
  [13] = {
    [ts_builtin_sym_end] = ACTIONS(46),
    [anon_sym_LPAREN] = ACTIONS(46),
    [anon_sym_RPAREN] = ACTIONS(46),
    [sym_string] = ACTIONS(48),
    [sym_number] = ACTIONS(48),
    [anon_sym_true] = ACTIONS(48),
    [anon_sym_false] = ACTIONS(48),
    [sym_symbol] = ACTIONS(48),
    [anon_sym_module] = ACTIONS(48),
    [anon_sym_defun] = ACTIONS(48),
    [anon_sym_with_DASHcapability] = ACTIONS(48),
    [anon_sym_defpact] = ACTIONS(48),
  },
  [14] = {
    [ts_builtin_sym_end] = ACTIONS(50),
    [anon_sym_LPAREN] = ACTIONS(50),
    [anon_sym_RPAREN] = ACTIONS(50),
    [sym_string] = ACTIONS(52),
    [sym_number] = ACTIONS(52),
    [anon_sym_true] = ACTIONS(52),
    [anon_sym_false] = ACTIONS(52),
    [sym_symbol] = ACTIONS(52),
    [anon_sym_module] = ACTIONS(52),
    [anon_sym_defun] = ACTIONS(52),
    [anon_sym_with_DASHcapability] = ACTIONS(52),
    [anon_sym_defpact] = ACTIONS(52),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 2,
    ACTIONS(54), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(56), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [16] = 2,
    ACTIONS(58), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(60), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [32] = 2,
    ACTIONS(62), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(64), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [48] = 2,
    ACTIONS(66), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(68), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [64] = 2,
    ACTIONS(70), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(72), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [80] = 2,
    ACTIONS(74), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(76), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [96] = 2,
    ACTIONS(78), 2,
      anon_sym_LPAREN,
      anon_sym_RPAREN,
    ACTIONS(80), 9,
      sym_string,
      sym_number,
      anon_sym_true,
      anon_sym_false,
      sym_symbol,
      anon_sym_module,
      anon_sym_defun,
      anon_sym_with_DASHcapability,
      anon_sym_defpact,
  [112] = 3,
    ACTIONS(82), 1,
      ts_builtin_sym_end,
    ACTIONS(84), 1,
      anon_sym_LPAREN,
    STATE(22), 2,
      sym_list,
      aux_sym_source_repeat1,
  [123] = 3,
    ACTIONS(5), 1,
      anon_sym_LPAREN,
    ACTIONS(87), 1,
      ts_builtin_sym_end,
    STATE(22), 2,
      sym_list,
      aux_sym_source_repeat1,
  [134] = 1,
    ACTIONS(89), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(15)] = 0,
  [SMALL_STATE(16)] = 16,
  [SMALL_STATE(17)] = 32,
  [SMALL_STATE(18)] = 48,
  [SMALL_STATE(19)] = 64,
  [SMALL_STATE(20)] = 80,
  [SMALL_STATE(21)] = 96,
  [SMALL_STATE(22)] = 112,
  [SMALL_STATE(23)] = 123,
  [SMALL_STATE(24)] = 134,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source, 0),
  [5] = {.entry = {.count = 1, .reusable = true}}, SHIFT(2),
  [7] = {.entry = {.count = 1, .reusable = true}}, SHIFT(13),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(15),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT(18),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(7),
  [15] = {.entry = {.count = 1, .reusable = false}}, SHIFT(8),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(9),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(10),
  [21] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(2),
  [24] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_list_repeat1, 2),
  [26] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(15),
  [29] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(18),
  [32] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(7),
  [35] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(8),
  [38] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(9),
  [41] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_list_repeat1, 2), SHIFT_REPEAT(10),
  [44] = {.entry = {.count = 1, .reusable = true}}, SHIFT(14),
  [46] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_list, 2),
  [48] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_list, 2),
  [50] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_list, 3),
  [52] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_list, 3),
  [54] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_expression, 1),
  [56] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_expression, 1),
  [58] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_module_declaration, 2),
  [60] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_module_declaration, 2),
  [62] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_definition, 1),
  [64] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_definition, 1),
  [66] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_boolean, 1),
  [68] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_boolean, 1),
  [70] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_defun_declaration, 3, .production_id = 1),
  [72] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_defun_declaration, 3, .production_id = 1),
  [74] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_with_capability_declaration, 3, .production_id = 2),
  [76] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_with_capability_declaration, 3, .production_id = 2),
  [78] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_defpact_declaration, 4, .production_id = 3),
  [80] = {.entry = {.count = 1, .reusable = false}}, REDUCE(sym_defpact_declaration, 4, .production_id = 3),
  [82] = {.entry = {.count = 1, .reusable = true}}, REDUCE(aux_sym_source_repeat1, 2),
  [84] = {.entry = {.count = 2, .reusable = true}}, REDUCE(aux_sym_source_repeat1, 2), SHIFT_REPEAT(2),
  [87] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_source, 1),
  [89] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef _WIN32
#define extern __declspec(dllexport)
#endif

extern const TSLanguage *tree_sitter_pact(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .field_names = ts_field_names,
    .field_map_slices = ts_field_map_slices,
    .field_map_entries = ts_field_map_entries,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
