import { describe, expect, it } from 'vitest';
import { getLexerOutput } from '../lexer';

describe('lexer', () => {
  type Expression = string;
  type ExpectedTokenCount = number;
  type ExpectedSequence = string[];
  type TestTuple = [Expression, ExpectedTokenCount, ...ExpectedSequence];

  const testsAndExpected: TestTuple[] = [
    ['', 0],
    ['()', 2, 'lparen', 'rparen'],
    ['(module)', 3, 'lparen', 'module', 'rparen'],
    ['(free.module)', 5, 'lparen', 'atom', 'dot', 'module', 'rparen'],
    [`(module "start end")`, 5, 'module', 'string'],
    [`(module "" "end")`, 7, 'module', 'string', 'string'],
    [
      `(module "start\\
      \\continue\\
      \\end")`,
      5,
      'module',
      'string',
    ],
    [
      `(module "start"
        statement "end")`,
      10,
      'string',
      'nl',
      'atom',
      'string',
    ],
    [`(module "start" "end")`, 7, 'string', 'string'],
    [`(module 'a-symbol)`, 5, 'symbol'],
    [`(module 1)`, 5, 'int'],
    [`(module 1.0)`, 5, 'decimal'],
    [`(module 1.)`, 6, 'int', 'dot'],
    [`(module -1.0)`, 5, 'decimal'],
    [`'a-symbol`, 1, 'symbol'],
    [`100.25`, 1, 'decimal'],
    [`-922337203685477580712387461234`, 1, 'int'],
    [`(and true false)`, 7, 'boolean', 'boolean'],
    [
      `(module [1, 2, 3])`,
      13,
      'lsquare',
      'int',
      'comma',
      'int',
      'comma',
      'int',
      'rsquare',
    ],
    [
      `{ "foo": (+ 1 2.0) }`,
      14,
      'lcurly',
      'string',
      'colon',
      'lparen',
      'atom',
      'int',
      'decimal',
      'rparen',
      'rcurly',
    ],
    [`{ "balance" := bal }`, 9, 'string', 'assign', 'atom'],
    [`{ "balance" := 'bal }`, 9, 'string', 'assign', 'symbol'],
    [
      `module:{fungible-v2,user.votable}`,
      9,
      'module',
      'colon',
      'lcurly',
      'atom',
      'comma',
      'atom',
      'dot',
      'atom',
      'rcurly',
    ],
    [`(bar::quux 1 "hi")`, 9, 'atom', 'dereference', 'atom', 'int', 'string'],
    [`(defun prefix:string (pfx:string str:string) (+ pfx ""))`, 25],
    [
      `(defun average (a b)
      @doc   "some sum"
      @model (property (= (+ a b) (* 2 result)))
      (/ (+ a b) 2))`,
      58,
    ],
    [`;; comment`, 1, 'comment'],
    [`() ;; comment`, 4, 'lparen', 'rparen', 'comment'],
    [
      `;; comment
    () ;; comment`,
      7,
      'comment',
      'nl',
      'lparen',
      'rparen',
      'comment',
    ],
    [`(let* ())`, 6, 'let_star'],
    [`(step-with-rollback)`, 3, 'lparen', 'stepWithRollback', 'rparen'],
    [`(defun prefix:string (pfx:string str:string))`, 17],
    ...[
      'bless',
      'defun',
      'defcap',
      'defconst',
      'defpact',
      'defschema',
      'deftable',
      'let',
      'cond',
      'step',
      'use',
      'interface',
      'module',
      'implements',
    ].map(
      (atom) =>
        [`(${atom})`, 3, atom] as [
          Expression,
          ExpectedTokenCount,
          ...ExpectedSequence,
        ],
    ),
  ];

  testsAndExpected.forEach(
    ([test, expectedTokenCount, ...expectedSequence], index) => {
      it(`tokenizes "${test}" in "${expectedTokenCount}" tokens ${
        expectedSequence.length ? `with "${expectedSequence?.join(',')}"` : ``
      }`, () => {
        // only log last one
        const logger =
          // eslint-disable-next-line no-constant-condition
          false && index === testsAndExpected.length - 1
            ? console.log
            : () => {};

        const output = getLexerOutput(test, logger);
        const outputWithoutLogger = getLexerOutput(test);
        // match given length
        expect(output).toHaveLength(expectedTokenCount);
        expect(output).toEqual(outputWithoutLogger);
        expect(
          output
            .map(({ type }) => type)
            .filter((t) => t !== 'ws')
            .join(),
        ).toContain(expectedSequence?.join());
      });
    },
  );
});
