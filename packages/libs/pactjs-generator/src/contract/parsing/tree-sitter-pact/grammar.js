// const clojure = require('tree-sitter-clojure/grammar');

module.exports = grammar(
  // clojure,
  {
    name: 'pact',

    rules: {
      source: ($) => repeat($.list),
      list: ($) => seq('(', repeat($.expression), ')'),
      expression: ($) =>
        choice(
          $.definition,
          $.list,
          $.string,
          $.number,
          $.boolean,
          $.symbol,
        ),
      string: ($) => /"[^"]*"/,
      number: ($) => /-?\d+/,
      boolean: ($) => choice('true', 'false'),
      symbol: ($) => /[^()\s]+/,
      definition: ($) => choice(
          $.module_declaration,
          $.defun_declaration,
          $.with_capability_declaration,
          $.defpact_declaration,
      ),
      module_declaration: ($) => seq('module', $.expression),
      defun_declaration: ($) =>
        seq('defun', field('name', $.expression), field('args', $.expression)),
      with_capability_declaration: ($) =>
        seq(
          'with-capability',
          field('capability', $.expression),
          field('body', $.expression),
        ),
      defpact_declaration: ($) =>
        seq(
          'defpact',
          field('name', $.expression),
          field('args', $.expression),
          field('body', $.expression),
        ),
    },
  },
);
