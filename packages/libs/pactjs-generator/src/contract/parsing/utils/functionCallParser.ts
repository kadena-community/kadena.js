/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */
// In this module, we generate new functions by composing other functions. In order to allow TypeScript to automatically infer the types,
// I had to disable these rules.
import type { IPointer } from './getPointer';
import type { IParser, RuleReturn } from './parser-utilities';
import {
  $,
  FAILED,
  atom,
  id,
  maybe,
  oneOf,
  repeat,
  restrictedBlock,
  seq,
  str,
  type,
} from './parser-utilities';

export const functionCall = oneOf(
  // namespace.module.function
  seq(
    $('namespace', atom),
    id('.'),
    $('module', atom),
    id('.'),
    $('name', atom),
  ),
  // module.function
  seq($('module', atom), id('.'), $('name', atom)),
  seq($('name', atom)),
);

const object = (rule: IParser) =>
  seq(
    id('{'),
    repeat(
      $(
        'object',
        seq($('property', str), id(':'), $('value', rule), maybe(id(','))),
      ),
    ),
    id('}'),
  );

const list = (rule: IParser) => seq(id('['), repeat($('list', rule)), id(']'));

const code = (rule: IParser) =>
  restrictedBlock(
    // function
    $('function', functionCall),
    repeat($('args', rule)),
  );

// initiate parser on demand
const lazyParser = <T extends IParser>(parser: () => T): T =>
  ((pointer: IPointer) => parser()(pointer)) as T;

type ArgParser = IParser<
  | RuleReturn<string, 'string' | 'decimal' | 'int'>
  | RuleReturn<unknown, 'list'>
  | RuleReturn<Record<string, unknown>, 'object'>
  | RuleReturn<unknown, 'code'>
>;

const arg: ArgParser = lazyParser(
  () =>
    oneOf(
      // valid args
      $('string', str),
      $('decimal', type('decimal')),
      $('int', type('int')),
      // object($('worked', arg)),
      // $('list', list(arg)),
      object(arg),
      list(arg),
      // $('object', object(arg)),
      $('code', code(arg)),
    ) as ArgParser,
);

export const functionCallParser = (pointer: IPointer) => {
  const rule = repeat($('codes', code(arg)));
  const result = rule(pointer);
  if (pointer.done()) {
    // return the result if all tokens are consumed
    return result;
  }
  return FAILED;
};
